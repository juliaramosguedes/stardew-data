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
├── config.ts         — RAW_PATH and output paths from env
├── types.ts          — TypeScript types for raw and processed data
├── utils.ts          — shared helpers (readJson, writeJson, log)
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
npm run parse
```

## RAW_PATH

Set in .env. Points to the Content (unpacked) folder from StardewXnbHack.

macOS default:
RAW_PATH=/Users/julia/Library/Application Support/Steam/steamapps/common/Stardew Valley/Contents/MacOS/Content (unpacked)

## Game version

1.6.15 (verified). Spritesheet dimensions: crops.png = 256x1024, tile size = 16x32, 16 columns.

## Known issues to fix

- fish.ts: Raw fish data in 1.6 may not have SpawnData on the Object — cross-reference with Data/Locations.json for spawn locations
- npcs.ts: NPCGiftTastes.json in 1.6 uses a different format — verify slash-separated string parsing
- sprites.ts: springobjects.png may not be the correct sheet for all objects — some use custom Texture fields
- Sprite coordinates for crops: verify col/row calculation with actual SpriteIndex values

## Next parsers to add

- tools.ts — Tools.json
- fruittrees.ts — FruitTrees.json
- machines.ts — Machines.json
- quests.ts — Quests.json
- locations.ts — Locations.json (fish spawn data)
- shops.ts — Shops.json

## Output format

Every processed JSON has a _meta field with source, gameVersion, and generatedAt.

## No comments in code

Do not add inline comments. Code should be self-explanatory through naming.
