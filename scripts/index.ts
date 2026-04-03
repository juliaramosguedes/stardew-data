import { section } from "./utils.ts"
import { LOCALE, SUPPORTED_LOCALES } from "./config.ts"
import { parseCrops } from "./parsers/crops.ts"
import { parseObjects } from "./parsers/objects.ts"
import { parseFish } from "./parsers/fish.ts"
import { parseNPCs } from "./parsers/npcs.ts"
import { parseBuildings } from "./parsers/buildings.ts"
import { parseMonsters } from "./parsers/monsters.ts"
import { parseWeapons } from "./parsers/weapons.ts"
import { parseBundles } from "./parsers/bundles.ts"
import { parseRecipes } from "./parsers/recipes.ts"
import { parseTools } from "./parsers/tools.ts"
import { parseFruitTrees } from "./parsers/fruittrees.ts"
import { parseMachines } from "./parsers/machines.ts"
import { parseQuests } from "./parsers/quests.ts"
import { parseLocations } from "./parsers/locations.ts"
import { parseShops } from "./parsers/shops.ts"
import { parseBigCraftables } from "./parsers/bigcraftables.ts"
import { parseBoots } from "./parsers/boots.ts"
import { parseFurniture } from "./parsers/furniture.ts"
import { parseBooks } from "./parsers/books.ts"
import { parseSpecialOrders } from "./parsers/specialorders.ts"
import { parseWildTrees } from "./parsers/wildtrees.ts"
import { parseHats } from "./parsers/hats.ts"
import { parseClothing } from "./parsers/clothing.ts"
import { parseTrinkets } from "./parsers/trinkets.ts"
import { parseFarmAnimals } from "./parsers/farmanimals.ts"
import { parseFishPonds } from "./parsers/fishponds.ts"
import { parseMonsterSlayerQuests } from "./parsers/monsterslayerquests.ts"
import { parseTailoringRecipes } from "./parsers/tailoringrecipes.ts"
import { parseAchievements } from "./parsers/achievements.ts"
import { parseGiantCrops } from "./parsers/giantcrops.ts"
import { parseMuseumRewards } from "./parsers/museumrewards.ts"
import { parseBuffs } from "./parsers/buffs.ts"
import { parseFloorsAndPaths } from "./parsers/floorsandpaths.ts"
import { parsePets } from "./parsers/pets.ts"
import { parseGarbageCans } from "./parsers/garbagecans.ts"
import { parseMannequins } from "./parsers/mannequins.ts"
import { parseFences } from "./parsers/fences.ts"
import {
  extractCropSprites,
  extractObjectSprites,
  extractObjectsExtendedSprites,
  extractBigCraftableSprites,
  extractWeaponSprites,
  extractToolSprites,
  extractHatSprites,
  extractBuffIconSprites,
  extractFurnitureSprites,
  extractShirtSprites,
  extractPortraitSprites,
  extractCharacterSprites,
} from "./parsers/sprites.ts"

const args = process.argv.slice(2)
const onlyIndex = args.indexOf("--only")
const only = onlyIndex !== -1 ? args[onlyIndex + 1] : null
const runAll = args.includes("--all")

async function runData() {
  section(`Parsing game data (${LOCALE})`)
  parseObjects()
  parseCrops()
  parseFish()
  parseNPCs()
  parseBuildings()
  parseMonsters()
  parseWeapons()
  parseBundles()
  parseRecipes()
  parseTools()
  parseFruitTrees()
  parseMachines()
  parseQuests()
  parseLocations()
  parseShops()
  parseBigCraftables()
  parseBoots()
  parseFurniture()
  parseBooks()
  parseSpecialOrders()
  parseWildTrees()
  parseHats()
  parseClothing()
  parseTrinkets()
  parseFarmAnimals()
  parseFishPonds()
  parseMonsterSlayerQuests()
  parseTailoringRecipes()
  parseAchievements()
  parseGiantCrops()
  parseMuseumRewards()
  parseBuffs()
  parseFloorsAndPaths()
  parsePets()
  parseGarbageCans()
  parseMannequins()
  parseFences()
}

async function runSprites() {
  section("Extracting sprites")
  await extractCropSprites()
  await extractObjectSprites()
  await extractObjectsExtendedSprites()
  await extractBigCraftableSprites()
  await extractWeaponSprites()
  await extractToolSprites()
  await extractHatSprites()
  await extractBuffIconSprites()
  await extractFurnitureSprites()
  await extractShirtSprites()
  await extractPortraitSprites()
  await extractCharacterSprites()
}

async function runLocale() {
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

async function main() {
  if (runAll) {
    const { spawnSync } = await import("node:child_process")
    for (const locale of SUPPORTED_LOCALES) {
      const flag = `--${locale.toLowerCase()}`
      const nodeArgs = ["--env-file=.env", "--experimental-strip-types", "scripts/index.ts", flag]
      if (only) nodeArgs.push("--only", only)
      const result = spawnSync(process.execPath, nodeArgs, { stdio: "inherit" })
      if (result.status !== 0) process.exit(result.status ?? 1)
    }
  } else {
    await runLocale()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
