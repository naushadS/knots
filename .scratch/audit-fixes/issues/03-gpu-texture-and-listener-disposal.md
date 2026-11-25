# 03: GPU texture & listener disposal in viewer and stage

**What to build:** Switching knots or unmounting the 3D viewer frees all Three.js textures (`cutFaces` texture, `map`, and `normalMap`) alongside child geometries and materials so WebGL memory stays bounded. Leaving a knot stage before the 2-second auto-play buffer fills immediately unsubscribes the player listener.

**Blocked by:** None (can start immediately)

**Status:** done

- [ ] `RopeMesh` exposes a `dispose()` method that disposes its cut-face `DataTexture`, child materials, and child geometries, and `KnotViewer.clear()` calls it.
- [ ] `KnotViewer.dispose()` disposes `map` and `normalMap` textures on each shared `MeshPhysicalMaterial` before disposing the material.
- [ ] `KnotStage` unsubscribes its auto-play `player.subscribe` listener in its cleanup function alongside `session.dispose()`.
- [ ] Unit tests verify texture disposal on `KnotViewer.clear()` / `dispose()` and listener cleanup on `KnotStage` unmount.
