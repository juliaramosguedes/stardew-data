# CLAUDE.md — stardew-data

## Project

TypeScript pipeline that extracts and processes all Stardew Valley game data from local unpacked game files.

## Stack

- Node.js 24 + TypeScript
- `sharp` for sprite extraction
- `tsx` to run TypeScript directly
- No build step needed for development

## Structure

```
scripts/
├── index.ts          — entry point, runs all parsers
├── config.ts         — RAW_PATH, LOCALE, output paths from env/args
├── types.ts          — TypeScript types for raw and processed data
├── utils.ts          — shared helpers (readJson, writeJson, log)
├── utils/
│   ├── locale.ts     — loadLocaleData, StringsResolver
│   ├── parse.ts      — parseSlashFields
│   └── game.ts       — lookupItemName, parseDropPairs, etc.
└── parsers/
    ├── crops.ts      — Crops.json + Objects.json → crops.json
    ├── objects.ts    — Objects.json → objects.json
    ├── fish.ts       — Objects.json (category -4) → fish.json
    ├── npcs.ts       — Characters.json + NPCGiftTastes.json → npcs.json
    ├── buildings.ts  — Buildings.json → buildings.json
    ├── monsters.ts   — Monsters.json → monsters.json
    ├── weapons.ts    — Weapons.json → weapons.json
    ├── bundles.ts    — Bundles.json → bundles.json
    ├── recipes.ts    — CookingRecipes.json + CraftingRecipes.json → recipes.json
    └── sprites.ts    — TileSheets/*.png → sprites/**/*.png
```

## Running

```fish
cp .env.example .env
npm install
npm run parse          # en-US (default)
npm run parse:pt-br    # Portuguese
npm run parse:all      # all 12 locales
npm run parse:sprites  # sprites only
```

## RAW_PATH

Set in .env. Points to the Content (unpacked) folder from StardewXnbHack.

macOS default:
RAW_PATH=/Users/julia/Library/Application Support/Steam/steamapps/common/Stardew Valley/Contents/MacOS/Content (unpacked)

## Game version

1.6.15 (verified). Spritesheet dimensions: crops.png = 256x1024, tile size = 16x32, 16 columns.

## Output format

Every processed JSON has a _meta field with source, gameVersion, and generatedAt.
Output goes to `data/{locale}/` (e.g. `data/en-US/objects.json`, `data/pt-BR/objects.json`).
Sprites go to `sprites/` (locale-neutral).

## Localization

Three mechanisms:
- **Full file replacement**: `Data/Achievements.pt-BR.json` replaces `Data/Achievements.json` → handled by `loadLocaleData()`
- **Strings/ lookup**: `Strings/Objects.pt-BR.json` keys `{id}_Name`, `{id}_Description` → handled by `StringsResolver`
- **[LocalizedText] tokens**: `[LocalizedText Strings\\StringsFromCSFiles:key]` in field values → handled by `StringsResolver.resolveToken()`

Supported locales: en-US (default), pt-BR, de-DE, es-ES, fr-FR, hu-HU, it-IT, ja-JP, ko-KR, ru-RU, tr-TR, zh-CN

## Known issues to fix

- fish.ts: Raw fish data in 1.6 may not have SpawnData on the Object — cross-reference with Data/Locations.json for spawn locations
- npcs.ts: NPCGiftTastes.json in 1.6 uses a different format — verify slash-separated string parsing
- sprites.ts: springobjects.png may not be the correct sheet for all objects — some use custom Texture fields
- Sprite coordinates for crops: verify col/row calculation with actual SpriteIndex values

## Implemented parsers

objects, crops, fish, npcs, buildings, monsters, weapons, bundles, recipes, tools, fruittrees, machines, quests, locations, shops, bigcraftables, boots, furniture, books, specialorders, wildtrees, hats, clothing, trinkets, farmanimals, fishponds, monsterslayerquests, tailoringrecipes, achievements, giantcrops, museumrewards, buffs, floorsandpaths, pets, garbagecans, mannequins, fences

## No comments in code

Do not add inline comments. Code should be self-explanatory through naming.
