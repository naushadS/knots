# 02: Canonical favorites QR decoding & accurate import warning

**What to build:** All favorites QR and link import flows decode bitmasks against the permanent append-only canonical knot registry (`CANONICAL_KNOT_IDS`), matching encoding even if the display menu order changes. The import modal only displays the "Shared from a newer version" warning when the sender's version is actually newer than the receiver's.

**Blocked by:** None (can start immediately)

**Status:** done

- [ ] Favorites import callers (`FavoritesScreen`, `ScanChoiceSheet`, `ScannerModal`) omit the menu-order catalog override so `parseFavoritesUri` defaults to `CANONICAL_KNOT_IDS`.
- [ ] `ImportFavoritesModal` guards the "Shared from a newer version" sentence behind `validation.isNewer`, showing only the unknown-knot message when versions match or sender is older.
- [ ] Tests verify bitmask round-trips remain invariant when display menu order differs from `CANONICAL_KNOT_IDS`, and verify `ImportFavoritesModal` warning text for `isNewer === false` with unknown knot IDs.
