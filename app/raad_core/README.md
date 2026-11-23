# raad_core

Shared Flutter package for the Raad driver and parent apps.

- `lib/theme/`: the Raad design system. `generated/` is written by `npm run tokens` (repo root) from
  `shared/design/tokens.json` and `icons.json`. Never edit it by hand.
  - `RaadColors`, `RaadSpace`, `RaadRadius`, `RaadShadows`, `RaadMotion`, `RaadStatus`
  - `RaadText`: the 17 text styles (Outfit, Inter, JetBrains Mono, bundled in `fonts/`)
  - `RaadTheme.light()`: Material theme + `RaadSemanticColors` extension
  - `RaadIcon`, `RaadMark`, `RaadStatusPill`, `RaadButton`, `RaadPlateTag`
- `lib/debug/`: `RaadDesignSystemScreen`, a debug screen to compare with Figma page 0.
- `lib/models/`, `lib/api/`, `lib/socket/`, `lib/auth/`: filled in by later tasks.

Fonts are SIL Open Font License 1.1; the licences are in `fonts/`.
