# 06: Remove hot-loop array allocations in physics substep

**What to build:** The Cosserat-rod physics substep reuses a preallocated scratch buffer and reads quaternion scalars directly instead of allocating short-lived array literals per segment per substep, reducing GC pressure and speeding up baking while keeping simulation output bit-identical.

**Blocked by:** None (can start immediately)

**Status:** done

- [ ] `RopeSim` eliminates per-substep array literal allocations in `relative()`, `solveStretchShear()`, and `addMul()` using a reusable `Float64Array(4)` scratch buffer and direct scalar reads.
- [ ] All existing simulation tests and `bake.fingerprint.test.ts` pass with bit-identical fingerprints.
