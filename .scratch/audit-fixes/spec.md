---
title: Codebase Audit Fixes & Performance Improvements
labels: [ready-for-agent]
status: done
---

# Codebase Audit Fixes & Performance Improvements

## Problem Statement

A thorough audit of the Knots Made Easy codebase uncovered 11 concrete reliability, correctness, performance, and maintainability issues across the simulation, 3D renderer, favorites sharing, settings, updater, and lint checks:

1. Users who tune rope physics (`friction`, `internalDamping`) via `?tune` or receive updated knot definitions can see stale cached animations from IndexedDB because the bake cache key omits several physics and knot parameters.
2. Users who share or import favorites via QR codes or links risk decoding the wrong knots if the home menu order ever diverges from the canonical knot ID registry.
3. Users browsing multiple knots in one session accumulate leaked GPU textures (`DataTexture` instances for rope fibers, normals, and cut faces) because disposing materials does not dispose attached textures.
4. Users who switch the Quality setting between "High Quality" and "Battery Saver" see no effect because the preference is never read by the 3D viewer or mesh builder.
5. Frame rendering and background baking do unnecessary work: the 3D rope mesh recomputes and re-uploads static UVs, ring trig, and duplicate vertex coordinates every frame, while the physics substep allocates hundreds of thousands of short-lived arrays per second.
6. The repository linter currently fails with 9 feature-boundary import errors and 7 React Hook/Compiler warnings.
7. Several smaller UX and resilience rough edges exist: misleading "newer version" warning text when importing unknown slugs from the same version, uncached IndexedDB handles opened on every read/write, silent worker errors in the timeline, an unreturned subscription cleanup in the stage, and an unused `sha256` field in the app updater.

## Solution

Resolve all 11 findings cleanly at their owning module boundaries while preserving deterministic physics output and existing UX:

- Make the IndexedDB bake cache key complete and versioned, reuse a single database connection, and surface worker failures cleanly.
- Standardize all favorites QR/link decoding on the canonical append-only knot registry and fix the version-mismatch warning banner.
- Properly dispose all Three.js textures and child geometries/materials on knot switch and viewer unmount, and wire the Battery Saver quality preference into the stage and rope mesh.
- Eliminate static per-frame UV/trig/position recalculations in the rope mesh and hot-loop array allocations in the physics substep, verified against existing simulation fingerprints.
- Fix all linter errors and hook warnings, and either wire or remove the dead `sha256` update field.

## User Stories

1. As a user tuning rope material parameters (`friction`, `internalDamping`, `bend`, `twist`, `mass`, `airDamping`), I want the simulation to re-bake whenever any parameter changes, so that I never see stale cached frames from a previous configuration.
2. As a returning user after an app update that changes knot guides, props, or rope radius, I want the IndexedDB bake cache to automatically invalidate old entries, so that I always see the updated knot animation.
3. As a user sharing favorites via QR code or `knots://fav` link, I want imported bitmasks to always decode against the permanent canonical knot registry, so that reordering or curating the home menu never corrupts shared favorites.
4. As a user importing a favorites link containing an unknown knot ID from the same app version, I want the warning banner to accurately describe the unknown knot without falsely claiming the link came from a newer app version.
5. As a user browsing many knots in a single session on mobile or desktop, I want switching knots and leaving knot pages to free all GPU textures and geometries, so that WebGL memory stays bounded and does not lose context.
6. As a user on a low-end or battery-constrained device, I want selecting "Battery Saver" in Settings to reduce rendering density and pixel ratio, so that playback stays smooth and uses less power.
7. As a user watching or scrubbing a 3D knot animation, I want the rope mesh to skip redundant UV uploads and trig calculations per frame, so that frame times are faster and smoother.
8. As a user waiting for a knot to bake in the background, I want the physics solver to avoid unnecessary heap allocations per substep, so that initial baking finishes faster with less garbage-collection pause.
9. As a user whose browser fails to run the bake worker, I want the timeline to handle and report the worker error rather than hanging silently at frame zero.
10. As a user navigating away from a knot page before the 2-second auto-play buffer fills, I want the stage cleanup to unsubscribe all player listeners immediately, so that no stale callbacks fire or linger.
11. As an Android app user checking for updates, I want the update checker to either provide a valid release checksum or omit the unused checksum path, so that native update verification behaves predictably.
12. As a developer maintaining the repository, I want `pnpm lint`, `pnpm typecheck`, and `pnpm test` to all pass with zero errors, so that CI and React Compiler optimizations work reliably.

## Implementation Decisions

- **Bake cache key & IndexedDB connection (`Timeline`, `frameCache`):**
  - Expand the bake cache key builder to include all `RopePhysics` fields (`mass`, `bend`, `twist`, `friction`, `airDamping`, `internalDamping`), each rope's `radius` and `length`, a deterministic hash or serialization of `guides` and `props`, and a `SIM_VERSION` tag.
  - Cache the `IDBDatabase` open promise at module level in the frame cache module and reset it on `close` or `versionchange` events rather than opening a new connection per read/write.
  - Attach an `onerror` handler to the bake `Worker` in `Timeline` so worker failures are surfaced rather than left silent.

- **Favorites QR bitmask & import warning (`qr`, `FavoritesScreen`, `ScanChoiceSheet`, `ScannerModal`, `ImportFavoritesModal`):**
  - Remove explicit `knots.map(...)` catalog overrides in the import UI callers so `parseFavoritesUri` always uses the default append-only `CANONICAL_KNOT_IDS` registry matching `generateFavoritesUri`.
  - In `ImportFavoritesModal`, guard the `"Shared from a newer version..."` text behind `validation.isNewer`, showing only the unknown-knot explanation when `isNewer` is false.

- **GPU resource disposal & quality preference (`KnotViewer`, `RopeMesh`, `createStage`, `settings`):**
  - Add a `dispose()` method on `RopeMesh` that disposes its cut-face texture (`cutFaces` material `map`), child materials, and child geometries; call it from `KnotViewer.clear()`.
  - In `KnotViewer.dispose()`, explicitly dispose `map` and `normalMap` textures on each shared `MeshPhysicalMaterial` before disposing the material itself.
  - Read `getQualityPreference()` when constructing `RopeMesh` and `createStage`: in `"battery"` mode, force the lower-density mesh parameters, cap `renderer.setPixelRatio(1)`, and disable or reduce shadow map resolution.
  - In `KnotStage`, store the `unsubscribe` callback returned by `player.subscribe(...)` and invoke it in the `start` cleanup alongside `session.dispose()`.

- **Mesh & physics hot-loop optimizations (`RopeMesh`, `RopeSim`):**
  - In `RopeMesh`, compute vertex UVs once in the constructor (and remove `uvs.needsUpdate = true` from `update()`), precompute a `radial + 1` cosine/sine lookup table, and compute each vertex's `(x, y, z)` position once per update.
  - In `RopeSim`, eliminate per-substep array literal allocations in `relative()`, `solveStretchShear()`, and `addMul()` by reusing a small `Float64Array(4)` scratch buffer and reading quaternion scalars directly. Simulation math and determinism must remain bit-identical.

- **Updater & lint compliance (`updateService`, feature barrels, `HomeScreen`, `SettingsScreen`):**
  - In `updateService`, either parse the `sha256` checksum from release assets/body or remove the dead `sha256` field and conditional branch if native verification relies solely on APK signing.
  - Export updater components and types through the updater feature's barrel index, update screen imports to use feature barrels (resolving all `no-restricted-imports` errors), and refactor the `HomeScreen` and `SettingsScreen` effects/callbacks to resolve all `oxlint` React Hook and React Compiler warnings.

## Testing Decisions

Good tests verify external behavior through public module interfaces and DOM/user interactions rather than asserting on private fields or implementation details.

- **Simulation & Cache Seam (`Timeline`, `RopeSim`, `frameCache`):**
  - Prior art: existing `bake.fingerprint.test.ts` and `rope.test.ts`.
  - Verify `RopeSim` refactor preserves exact deterministic frame fingerprints across all knots.
  - Test `Timeline` / cache key generation to prove changing `friction`, `internalDamping`, `rope.radius`, or `guides` produces distinct cache keys, and verify worker error handling.

- **3D Viewer & Mesh Seam (`KnotViewer`, `RopeMesh`):**
  - Test `RopeMesh.update()` outputs (static UVs remain intact, vertex positions/normals match expected geometry) and verify `KnotViewer.clear()` / `dispose()` disposes attached `DataTexture`s and respects `"battery"` vs `"high"` quality settings.

- **Favorites QR & Import UI Seam (`qr`, `FavoritesScreen`, `ScanChoiceSheet`, `ScannerModal`, `ImportFavoritesModal`):**
  - Prior art: existing `qr.test.ts`.
  - Add/verify tests ensuring bitmask encode/decode remains invariant even if display menu order differs from `CANONICAL_KNOT_IDS`, and test `ImportFavoritesModal` rendering when `unknownKnotIds.length > 0` with `isNewer === false`.

- **Updater & Repo Gates (`updateService`, `oxlint`, `tsc`, `vitest`):**
  - Add unit test coverage for `checkForUpdate` checksum handling (if retained) and run `pnpm lint`, `pnpm typecheck`, and `pnpm test` as the final verification gate.

## Out of Scope

- Changes to native Android Kotlin/Java code under `android/`.
- Changes to `tools/` offline asset-generation scripts.
- Adding new knots or altering existing knot physics defaults/choreography.
- Rewriting Playwright E2E tests (`e2e/app.e2e.ts`), though existing E2E tests should remain green.

## Further Notes

- This spec synthesizes all 11 findings from the `/ponytail-audit` report and is ready to be split into tracer-bullet tickets via `/to-tickets`.
