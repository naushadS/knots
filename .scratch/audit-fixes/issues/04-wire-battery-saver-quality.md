# 04: Wire Battery Saver quality preference into viewer & mesh

**What to build:** Selecting "Battery Saver" in Settings reduces 3D rendering cost on the stage and rope mesh by using lower mesh density, capping pixel ratio to 1, and disabling or reducing shadows, while "High Quality" keeps current visuals.

**Blocked by:** 03: GPU texture & listener disposal in viewer and stage

**Status:** done

- [ ] `RopeMesh` reads `getQualityPreference()` and uses the lower-density LOD (`radial`, `sub`, `hairsPerRadius`) when set to `"battery"`.
- [ ] `createStage` reads `getQualityPreference()` and caps `renderer.setPixelRatio(1)` and disables or reduces shadow map size when set to `"battery"`.
- [ ] Tests verify `"battery"` vs `"high"` quality preference changes mesh density and stage pixel ratio/shadow configuration.
