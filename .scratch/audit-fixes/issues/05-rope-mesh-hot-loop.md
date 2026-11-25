# 05: Eliminate static UV/trig/position recalculation in rope mesh

**What to build:** `RopeMesh` computes static vertex UVs once at construction, precomputes the ring cosine/sine lookup table, and computes each vertex's `(x, y, z)` position once per frame so playback and scrubbing run faster with identical visuals.

**Blocked by:** 03: GPU texture & listener disposal in viewer and stage

**Status:** done

- [ ] `RopeMesh` populates the `uv` buffer once in its constructor and removes per-frame UV calculation and `uvs.needsUpdate = true` from `update()`.
- [ ] `RopeMesh` precomputes `cos`/`sin` values for `radial + 1` angles instead of calling `Math.cos`/`Math.sin` inside the nested ring loop.
- [ ] Vertex `(x, y, z)` is computed once per vertex in `RopeMesh.update()` rather than twice.
- [ ] Tests verify `RopeMesh.update()` produces unchanged positions, normals, colors, and UVs.
