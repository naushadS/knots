# 01: Complete bake cache key, DB connection reuse & worker errors

**What to build:** Tuning any rope physics parameter (including friction and internal damping) or updating knot geometry, guides, props, or simulation version invalidates stale IndexedDB bakes automatically. The frame cache reuses a single IndexedDB connection across reads and writes, and worker failures surface cleanly instead of leaving playback stuck at frame zero.

**Blocked by:** None (can start immediately)

**Status:** done

- [ ] Bake cache key includes all `RopePhysics` fields (`mass`, `bend`, `twist`, `friction`, `airDamping`, `internalDamping`), each rope's `length` and `radius`, a deterministic hash/serialization of `guides` and `props`, and a `SIM_VERSION` tag.
- [ ] `frameCache` caches the `openDB()` promise at module level and resets it on `close` or `versionchange` events.
- [ ] `Timeline` attaches an `onerror` handler to the bake worker so failures are reported rather than silently ignored.
- [ ] Unit tests verify cache key sensitivity to `friction`, `internalDamping`, `radius`, and `guides`, plus worker error handling.
