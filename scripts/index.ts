import { section } from "./utils.ts"
import { parseCrops } from "./parsers/crops.ts"
import { parseObjects } from "./parsers/objects.ts"
import { parseFish } from "./parsers/fish.ts"
import { parseNPCs } from "./parsers/npcs.ts"
import { parseBuildings } from "./parsers/buildings.ts"
import { parseMonsters } from "./parsers/monsters.ts"
import { parseWeapons } from "./parsers/weapons.ts"
import { parseBundles } from "./parsers/bundles.ts"
import { parseRecipes } from "./parsers/recipes.ts"
import {
  extractCropSprites,
  extractObjectSprites,
  extractPortraitSprites,
  extractCharacterSprites,
} from "./parsers/sprites.ts"

const args = process.argv.slice(2)
const onlyIndex = args.indexOf("--only")
const only = onlyIndex !== -1 ? args[onlyIndex + 1] : null

async function runData() {
  section("Parsing game data")
  parseObjects()
  parseCrops()
  parseFish()
  parseNPCs()
  parseBuildings()
  parseMonsters()
  parseWeapons()
  parseBundles()
  parseRecipes()
}

async function runSprites() {
  section("Extracting sprites")
  await extractCropSprites()
  await extractObjectSprites()
  await extractPortraitSprites()
  await extractCharacterSprites()
}

async function main() {
  const start = Date.now()

  if (only === "data") {
    await runData()
  } else if (only === "sprites") {
    await runSprites()
  } else {
    await runData()
    await runSprites()
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\n✓ Done in ${elapsed}s`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
