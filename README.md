# stardew-data

Game data pipeline for [Stardew Valley](https://www.stardewvalley.net/) by ConcernedApe.

Extracts and processes all game data from local unpacked game files for use in:
- [stardew-guide](https://github.com/juliaramosguedes/stardew-guide) — strategy guide website
- AI model training (object detection, strategy recommendation)
- Real-time game assistant (future)

**Game version:** 1.6.15

## Output

```
data/
└── {locale}/                  — e.g. en-US, pt-BR, de-DE
    ├── objects.json           — all items with prices, categories, and metadata
    ├── crops.json             — crops with growth days, seasons, and profit calculations
    ├── fish.json              — fish with locations, seasons, weather, and difficulty
    ├── npcs.json              — NPCs with gift tastes and birthdays
    ├── buildings.json         — farm buildings with build costs and materials
    ├── monsters.json          — mine monsters with drops and stats
    ├── weapons.json           — weapons with damage and combat stats
    ├── bundles.json           — Community Center bundles with ingredients
    ├── recipes.json           — cooking and crafting recipes
    ├── tools.json             — tools with upgrade chains
    ├── fruittrees.json        — fruit trees with seasons, fruit, and growth days
    ├── machines.json          — artisan machines with output rules and timing
    ├── quests.json            — quests with objectives, rewards, and quest chains
    ├── locations.json         — locations with catchable fish
    ├── shops.json             — shops with owners and available items
    ├── bigcraftables.json     — large craftable objects
    ├── boots.json             — boots with defense and immunity stats
    ├── furniture.json         — furniture with tile sizes and placement data
    ├── books.json             — books with skill bonuses
    ├── specialorders.json     — special orders from the board and Qi
    ├── wildtrees.json         — wild trees with tap items and growth data
    ├── hats.json              — hats with sprite data
    ├── clothing.json          — shirts and pants with dye flags
    ├── trinkets.json          — trinket items with drop flags
    ├── farmanimals.json       — farm animals with produce and housing
    ├── fishponds.json         — fish pond rules and produce chances
    ├── monsterslayerquests.json — Adventurers' Guild slayer targets
    ├── tailoringrecipes.json  — sewing machine recipes
    ├── achievements.json      — achievements with progress bar data
    ├── giantcrops.json        — giant crop spawn chances and harvests
    ├── museumrewards.json     — museum donation rewards
    ├── buffs.json             — food and drink buffs with icon data
    ├── floorsandpaths.json    — floor and path items
    ├── pets.json              — pet types with sounds and speed
    ├── garbagecans.json       — garbage can loot tables
    ├── mannequins.json        — mannequin display items
    └── fences.json            — fence types with health and sounds

sprites/                       — locale-neutral, extracted once
├── crops/                     — one PNG per crop (16×32)
├── objects/                   — one PNG per object (16×16)
├── bigcraftables/             — one PNG per craftable (16×32)
├── weapons/                   — one PNG per weapon (16×16)
├── tools/                     — one PNG per tool (16×16)
├── hats/                      — one PNG per hat (20×80, all 4 directions)
├── buffs/                     — one PNG per buff icon (16×16)
├── furniture/                 — one PNG per furniture piece (variable size)
├── shirts/                    — one PNG per shirt (8×32)
├── portraits/
│   └── <npc>/                 — one PNG per portrait frame (64×64)
└── characters/
    └── <npc>/                 — one PNG per frame (16×32, named <row>_<col>.png)
```

Each JSON file includes a `_meta` field with source, game version, and generation timestamp.

## Requirements

- Node.js 24+
- Stardew Valley installed (Steam)
- [StardewXnbHack](https://github.com/Pathoschild/StardewXnbHack) + SMAPI to unpack game files

## Setup

```fish
cp .env.example .env
npm install
```

Edit `.env` and set `RAW_PATH` to your unpacked Content folder.

**macOS (Steam):**
```
RAW_PATH=/Users/<you>/Library/Application Support/Steam/steamapps/common/Stardew Valley/Contents/MacOS/Content (unpacked)
```

## Usage

```fish
npm run parse            # parse all data (en-US) + extract sprites
npm run parse:data       # parse data only, en-US
npm run parse:sprites    # extract sprites only
npm run parse:en-us      # parse data for English
npm run parse:pt-br      # parse data for Brazilian Portuguese
npm run parse:all        # parse data for all 12 supported locales
npm run typecheck        # TypeScript type checking
npm run test:unit        # unit tests (no game files needed)
npm run test             # all tests (requires .env with RAW_PATH)
```

Supported locales: `en-US`, `pt-BR`, `de-DE`, `es-ES`, `fr-FR`, `hu-HU`, `it-IT`, `ja-JP`, `ko-KR`, `ru-RU`, `tr-TR`, `zh-CN`

## Architecture

```
scripts/
├── index.ts           — entry point, orchestrates all parsers and locales
├── config.ts          — RAW_PATH, LOCALE, output paths from env/args
├── types.ts           — TypeScript types for raw and processed data
├── utils.ts           — shared I/O helpers (readJson, writeJson, log)
├── schemas/
│   ├── raw.ts         — Zod schemas for all raw game data formats
│   └── strings.ts     — const field name tuples for slash-string parsers
├── utils/
│   ├── locale.ts      — loadLocaleData, StringsResolver
│   ├── parse.ts       — parseSlashFields, camelKeys
│   └── game.ts        — lookupItemName, parseDropPairs, parseItemIds
└── parsers/
    └── *.ts           — one file per data category → data/{locale}/*.json
    └── sprites.ts     → sprites/**/*.png
```

### Localization

Three mechanisms handle translated output per locale:

- **Full file replacement** — `Data/Achievements.pt-BR.json` replaces the base file entirely. Handled by `loadLocaleData()`.
- **Strings/ lookup** — `Strings/Objects.pt-BR.json` provides `{id}_Name` / `{id}_Description` keys for files like `Objects.json` and `Weapons.json`. Handled by `StringsResolver`.
- **`[LocalizedText]` tokens** — field values like `[LocalizedText Strings\\StringsFromCSFiles:key]` are resolved at parse time. Handled by `StringsResolver.resolveToken()`.

Sprites are locale-neutral and extracted once regardless of locale.

### Validation

Two layers per parser:

1. **Zod schemas** (`schemas/raw.ts`) — validate raw game data shape on a sample before parsing
2. **Const field tuples** (`schemas/strings.ts`) — define positional slash-string formats for files like `Monsters.json` and `Bundles.json`

Each parser exposes a pure entry function (e.g. `parseMonsterEntry`) that is unit-testable without game files, plus a top-level I/O function that reads raw files and writes output.

## Data sources

All data extracted directly from Stardew Valley game files (no wiki or third-party sources).
Stardew Valley is created by [ConcernedApe](https://www.concernedape.com/).
This project is not affiliated with or endorsed by ConcernedApe.

## Related

- [stardew-guide](https://github.com/juliaramosguedes/stardew-guide) — the website consuming this data
