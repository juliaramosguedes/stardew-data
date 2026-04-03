# Sources & Data Validation Log

All data in this repository is extracted directly from Stardew Valley game files.
No wiki, third-party datasets, or external APIs are used.

## Primary source

| Source | Path | Method |
|---|---|---|
| Game data | `Content (unpacked)/Data/*.json` | Direct extraction via `scripts/parsers/*.ts` |
| Sprite sheets | `Content (unpacked)/TileSheets/*.png`, `Maps/*.png`, `Characters/**/*.png` | Crop extraction via `sharp` |

Game files are unpacked locally using [StardewXnbHack](https://github.com/Pathoschild/StardewXnbHack) + SMAPI.

**Game version:** 1.6.15

## Attribution

Stardew Valley is created by [ConcernedApe](https://www.concernedape.com/) (Eric Barone).
This project is not affiliated with or endorsed by ConcernedApe.

Each output JSON file includes a `_meta` field with `source`, `gameVersion`, and `generatedAt` for traceability.

## Localization

Translated output is produced from locale files bundled with the game:

- `Data/*.{locale}.json` — full file replacements (e.g. `Achievements.pt-BR.json`)
- `Strings/*.{locale}.json` — name/description overrides (e.g. `Objects.pt-BR.json`)

No external translation sources are used.
