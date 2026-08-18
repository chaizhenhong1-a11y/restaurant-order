# Changelog

## [0.16.0] - Customer Entry & Table Validation UI

### Added
- Customer entry validation before showing the menu.
- Missing table-code screen.
- Invalid table-code screen.
- Disabled-table screen.
- Restaurant closed / ordering paused screen.
- Sticky table context bar.
- Table zone and seat-count display.
- Restaurant open status badge.
- Responsive mobile-friendly customer entry UI.
- Demo customer-table registry and entry state types.

### Changed
- Root customer page now validates the `?table=` query before rendering the menu.
- Valid table links continue into the existing customer menu UI.
- `/admin`, `/kitchen` and all other back-office routes remain unchanged.

### Demo Mode
Table validity and restaurant open/closed state currently come from demo data. Database-backed validation will be connected later.
