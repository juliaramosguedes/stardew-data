# stardew-data

Game data pipeline for [Stardew Valley](https://www.stardewvalley.net/) by ConcernedApe.

Extracts and processes all game data from local game files for use in:
- [stardew-guide](https://github.com/juliaramosguedes/stardew-guide) — strategy guide website
- AI model training (object detection, strategy recommendation)
- Real-time game assistant (future)

## What it generates

```
processed/
├── crops.json       — all crops with growth data, sell price, profit calculations
├── objects.json     — all items with prices and metadata
├── fish.json        — fish with locations, seasons, difficulty
├── npcs.json        — NPCs with gift tastes and birthdays
├── buildings.json   — farm buildings with build costs
├── monsters.json    — mine monsters with drops
├── weapons.json     — weapons with damage stats
├── bundles.json     — Community Center bundles
└── recipes.json     — cooking and crafting recipes

sprites/
├── crops/           — individual crop sprites (PNG)
├── objects/         — individual item sprites (PNG)
├── portraits/       — NPC portrait sheets (PNG)
└── characters/      — NPC character sprite sheets (PNG)
```

## Requirements

- Node.js 20+
- Stardew Valley installed (Steam)
- [StardewXnbHack](https://github.com/Pathoschild/StardewXnbHack) + SMAPI to unpack game files

## Setup

```bash
cp .env.example .env
npm install
```

Edit `.env` and set `RAW_PATH` to your unpacked Content folder.

## Usage

```bash
npm run parse            # parse data + extract sprites
npm run parse:data       # parse data only
npm run parse:sprites    # extract sprites only
```

## RAW_PATH

**macOS (Steam):**
```
RAW_PATH=/Users/<you>/Library/Application Support/Steam/steamapps/common/Stardew Valley/Contents/MacOS/Content (unpacked)
```

## Data sources

All data extracted from Stardew Valley game files.
Stardew Valley is created by [ConcernedApe](https://www.concernedape.com/).
This project is not affiliated with or endorsed by ConcernedApe.

## Related

- [stardew-guide](https://github.com/juliaramosguedes/stardew-guide) — the website consuming this data
