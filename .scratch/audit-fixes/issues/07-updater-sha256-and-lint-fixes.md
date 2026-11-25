# 07: Clean up updater sha256 & fix all oxlint errors/warnings

**What to build:** The app updater either populates `sha256` from release metadata or drops the unused field, all screens import features through their barrel indexes, and React Hook/Compiler warnings in `HomeScreen` and `SettingsScreen` are resolved so the linter, typechecker, and test suite all pass cleanly.

**Blocked by:** None (can start immediately)

**Status:** done

- [ ] `updateService` either populates `UpdateInfo.sha256` from release assets/body (with a unit test) or removes the dead `sha256` field and branch.
- [ ] Updater symbols needed by screens are exported through the updater feature's barrel index and all `no-restricted-imports` lint errors are resolved.
- [ ] `HomeScreen` and `SettingsScreen` resolve all `oxlint` `set-state-in-effect`, `immutability`, and `exhaustive-deps` warnings.
- [ ] `pnpm lint`, `pnpm typecheck`, and `pnpm test` all exit 0 with zero errors and zero warnings.
