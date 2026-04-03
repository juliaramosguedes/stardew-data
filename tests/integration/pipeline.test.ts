import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const PROCESSED = path.join(process.cwd(), "data", "en-US")
const skip = !process.env.RAW_PATH ? "RAW_PATH not set — skipping integration tests" : false

function readOutput<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(PROCESSED, file), "utf8")) as T
}

describe("parse pipeline", { skip }, () => {
  before(() => {
    execFileSync(process.execPath, [
      "--env-file=.env",
      "--experimental-strip-types",
      "scripts/index.ts",
      "--only", "data",
      "--en-us",
    ], { stdio: "pipe" })
  })

  test("objects.json — count and structure", () => {
    const { _meta, objects } = readOutput<{ _meta: unknown; objects: { id: string; name: string; sellPrice: number }[] }>("objects.json")
    assert.ok(_meta, "missing _meta")
    assert.ok(objects.length >= 700, `expected ≥700 objects, got ${objects.length}`)
    const parsnip = objects.find(o => o.name === "Parsnip")
    assert.ok(parsnip, "Parsnip not found")
    assert.equal(parsnip!.sellPrice, 35)
  })

  test("crops.json — count and structure", () => {
    const { crops } = readOutput<{ crops: { name: string; seasons: string[] }[] }>("crops.json")
    assert.ok(crops.length >= 40, `expected ≥40 crops, got ${crops.length}`)
    const parsnip = crops.find(c => c.name === "Parsnip")
    assert.ok(parsnip, "Parsnip crop not found")
    assert.deepEqual(parsnip!.seasons, ["Spring"])
  })

  test("fish.json — count and structure", () => {
    const { fish } = readOutput<{ fish: { name: string; sellPrice: number }[] }>("fish.json")
    assert.ok(fish.length >= 60, `expected ≥60 fish, got ${fish.length}`)
    const catfish = fish.find(f => f.name === "Catfish")
    assert.ok(catfish, "Catfish not found")
    assert.ok(catfish!.sellPrice > 0)
  })

  test("npcs.json — count and structure", () => {
    const { npcs } = readOutput<{ npcs: { name: string; lovedGifts: string[] }[] }>("npcs.json")
    assert.ok(npcs.length >= 30, `expected ≥30 NPCs, got ${npcs.length}`)
    const abigail = npcs.find(n => n.name === "Abigail")
    assert.ok(abigail, "Abigail not found")
    assert.ok(abigail!.lovedGifts.length > 0, "Abigail should have loved gifts")
  })

  test("buildings.json — count and structure", () => {
    const { buildings } = readOutput<{ buildings: { id: string; buildCost: number }[] }>("buildings.json")
    assert.ok(buildings.length >= 15, `expected ≥15 buildings, got ${buildings.length}`)
    const coop = buildings.find(b => b.id === "Coop")
    assert.ok(coop, "Coop not found")
    assert.ok(coop!.buildCost > 0)
  })

  test("monsters.json — count and structure", () => {
    const { monsters } = readOutput<{ monsters: { name: string; health: number; drops: unknown[] }[] }>("monsters.json")
    assert.ok(monsters.length >= 40, `expected ≥40 monsters, got ${monsters.length}`)
    const slime = monsters.find(m => m.name === "Green Slime")
    assert.ok(slime, "Green Slime not found")
    assert.ok(slime!.health > 0)
  })

  test("weapons.json — count and structure", () => {
    const { weapons } = readOutput<{ weapons: { name: string; minDamage: number }[] }>("weapons.json")
    assert.ok(weapons.length >= 50, `expected ≥50 weapons, got ${weapons.length}`)
    const club = weapons.find(w => w.name === "Wood Club")
    assert.ok(club, "Wood Club not found")
  })

  test("bundles.json — count and structure", () => {
    const { bundles } = readOutput<{ bundles: { name: string; room: string; ingredients: unknown[] }[] }>("bundles.json")
    assert.ok(bundles.length >= 25, `expected ≥25 bundles, got ${bundles.length}`)
    assert.ok(bundles.every(b => b.room.length > 0), "every bundle must have a room")
  })

  test("recipes.json — count and structure", () => {
    const { cooking, crafting } = readOutput<{
      cooking: { name: string; ingredients: unknown[] }[]
      crafting: { name: string; ingredients: unknown[] }[]
    }>("recipes.json")
    assert.ok(cooking.length >= 70, `expected ≥70 cooking recipes, got ${cooking.length}`)
    assert.ok(crafting.length >= 80, `expected ≥80 crafting recipes, got ${crafting.length}`)
    assert.ok(cooking.every(r => r.ingredients.length > 0), "all cooking recipes must have ingredients")
  })

  test("tools.json — count and upgrade chain", () => {
    const { tools } = readOutput<{ tools: { id: string; upgradeLevel: number; upgradeFrom: string | null }[] }>("tools.json")
    assert.ok(tools.length >= 20, `expected ≥20 tools, got ${tools.length}`)
    const axe = tools.find(t => t.id === "Axe")
    assert.ok(axe, "Axe not found")
    assert.equal(axe!.upgradeLevel, 0)
    assert.equal(axe!.upgradeFrom, null)
    const copperAxe = tools.find(t => t.id === "CopperAxe")
    assert.ok(copperAxe, "CopperAxe not found")
    assert.equal(copperAxe!.upgradeFrom, "Axe")
  })

  test("fruittrees.json — count and structure", () => {
    const { fruitTrees } = readOutput<{ fruitTrees: { name: string; seasons: string[]; fruit: unknown[] }[] }>("fruittrees.json")
    assert.ok(fruitTrees.length >= 7, `expected ≥7 fruit trees, got ${fruitTrees.length}`)
    const cherry = fruitTrees.find(t => t.name.toLowerCase().includes("cherry"))
    assert.ok(cherry, "Cherry Sapling not found")
    assert.deepEqual(cherry!.seasons, ["Spring"])
    assert.ok(cherry!.fruit.length > 0)
  })

  test("machines.json — count and structure", () => {
    const { machines } = readOutput<{ machines: { id: string; hasOutput: boolean; outputRules: unknown[] }[] }>("machines.json")
    assert.ok(machines.length >= 20, `expected ≥20 machines, got ${machines.length}`)
    assert.ok(machines.every(m => typeof m.hasOutput === "boolean"))
  })

  test("quests.json — count and quest chain", () => {
    const { quests } = readOutput<{ quests: { id: string; type: string; title: string; nextQuestId: string | null }[] }>("quests.json")
    assert.ok(quests.length >= 50, `expected ≥50 quests, got ${quests.length}`)
    const wizard = quests.find(q => q.title.includes("Wizard"))
    assert.ok(wizard, "Wizard quest not found")
    assert.equal(wizard!.type, "Location")
  })

  test("locations.json — count and fish data", () => {
    const { locations } = readOutput<{ locations: { id: string; fish: { itemId: string; chance: number }[] }[] }>("locations.json")
    assert.ok(locations.length >= 10, `expected ≥10 locations with fish, got ${locations.length}`)
    assert.ok(locations.every(l => l.fish.length > 0), "all locations must have at least one fish")
    assert.ok(locations.every(l => l.fish.every(f => f.itemId.startsWith("(O)"))), "all fish must have (O) prefix")
  })

  test("shops.json — count and owner data", () => {
    const { shops } = readOutput<{ shops: { id: string; owners: string[]; items: unknown[] }[] }>("shops.json")
    assert.ok(shops.length >= 10, `expected ≥10 shops, got ${shops.length}`)
    const pierre = shops.find(s => s.owners.includes("Pierre"))
    assert.ok(pierre, "Pierre's shop not found")
    assert.ok(pierre!.items.length > 0, "Pierre's shop should have items")
  })

  test("tailoringrecipes.json — count and structure", () => {
    const { tailoringRecipes } = readOutput<{ tailoringRecipes: { id: string; firstItemTags: string[]; secondItemTags: string[]; craftedItemId: string | null }[] }>("tailoringrecipes.json")
    assert.ok(tailoringRecipes.length >= 300, `expected ≥300 recipes, got ${tailoringRecipes.length}`)
    const shirts = tailoringRecipes.filter(r => r.craftedItemId?.startsWith("(S)"))
    assert.ok(shirts.length >= 200, `expected ≥200 shirt recipes, got ${shirts.length}`)
    const clothRecipes = tailoringRecipes.filter(r => r.firstItemTags.includes("item_cloth"))
    assert.ok(clothRecipes.length >= 200, `expected ≥200 cloth-based recipes, got ${clothRecipes.length}`)
  })

  test("monsterslayerquests.json — count and reward items", () => {
    const { monsterSlayerQuests } = readOutput<{ monsterSlayerQuests: { id: string; targets: string[]; count: number; rewardItemName: string }[] }>("monsterslayerquests.json")
    assert.ok(monsterSlayerQuests.length >= 10, `expected ≥10 quests, got ${monsterSlayerQuests.length}`)
    const slimes = monsterSlayerQuests.find(q => q.id === "Slimes")
    assert.ok(slimes, "Slimes quest not found")
    assert.equal(slimes!.count, 1000)
    assert.ok(slimes!.targets.includes("Green Slime"))
    assert.ok(slimes!.rewardItemName.length > 0)
  })

  test("fishponds.json — count and produce items", () => {
    const { fishPonds } = readOutput<{ fishPonds: { id: string; requiredTags: string[]; maxPopulation: number; producedItems: { name: string }[] }[] }>("fishponds.json")
    assert.ok(fishPonds.length >= 30, `expected ≥30 fish pond entries, got ${fishPonds.length}`)
    const sturgeon = fishPonds.find(p => p.id === "Sturgeon")
    assert.ok(sturgeon, "Sturgeon pond not found")
    assert.ok(sturgeon!.producedItems.length > 0)
    const legendary = fishPonds.find(p => p.id === "LegendaryFish")
    assert.ok(legendary, "LegendaryFish pond not found")
    assert.equal(legendary!.maxPopulation, 1)
  })

  test("farmanimals.json — count and produce", () => {
    const { farmAnimals } = readOutput<{ farmAnimals: { id: string; house: string; purchasePrice: number; produce: { itemId: string; name: string }[] }[] }>("farmanimals.json")
    assert.ok(farmAnimals.length >= 12, `expected ≥12 animals, got ${farmAnimals.length}`)
    const chicken = farmAnimals.find(a => a.id === "White Chicken")
    assert.ok(chicken, "White Chicken not found")
    assert.equal(chicken!.house, "Coop")
    assert.equal(chicken!.purchasePrice, 400)
    assert.ok(chicken!.produce.length > 0)
    assert.equal(chicken!.produce[0].name, "Egg")
  })

  test("hats.json — count and spriteIndex", () => {
    const { hats } = readOutput<{ hats: { id: string; name: string; showRealHair: boolean; spriteIndex: number }[] }>("hats.json")
    assert.ok(hats.length >= 100, `expected ≥100 hats, got ${hats.length}`)
    const cowboy = hats.find(h => h.name === "Cowboy Hat")
    assert.ok(cowboy, "Cowboy Hat not found")
    assert.equal(cowboy!.spriteIndex, 0)
    const tricorn = hats.find(h => h.name === "Tricorn Hat")
    assert.ok(tricorn, "Tricorn Hat not found")
    assert.equal(tricorn!.spriteIndex, 95)
  })

  test("clothing.json — shirt and pants counts", () => {
    const { shirts, pants } = readOutput<{ shirts: { id: string; name: string; hasSleeves: boolean }[]; pants: { id: string; name: string; defaultColor: string | null }[] }>("clothing.json")
    assert.ok(shirts.length >= 200, `expected ≥200 shirts, got ${shirts.length}`)
    assert.ok(pants.length >= 15, `expected ≥15 pants, got ${pants.length}`)
    const farmerPants = pants.find(p => p.name === "Farmer Pants")
    assert.ok(farmerPants, "Farmer Pants not found")
    assert.ok(farmerPants!.defaultColor !== undefined)
  })

  test("trinkets.json — count and drop flags", () => {
    const { trinkets } = readOutput<{ trinkets: { id: string; dropsNaturally: boolean; canBeReforged: boolean; effectClass: string }[] }>("trinkets.json")
    assert.ok(trinkets.length >= 5, `expected ≥5 trinkets, got ${trinkets.length}`)
    const frog = trinkets.find(t => t.id === "FrogEgg")
    assert.ok(frog, "FrogEgg not found")
    assert.equal(frog!.dropsNaturally, true)
    assert.equal(frog!.canBeReforged, true)
  })

  test("wildtrees.json — count and tap items", () => {
    const { wildTrees } = readOutput<{ wildTrees: { id: string; seedName: string; tapItems: { itemId: string; name: string; daysUntilReady: number }[] }[] }>("wildtrees.json")
    assert.ok(wildTrees.length >= 10, `expected ≥10 wild trees, got ${wildTrees.length}`)
    const oak = wildTrees.find(t => t.seedName === "Acorn")
    assert.ok(oak, "Oak tree (Acorn) not found")
    assert.ok(oak!.tapItems.length > 0, "Oak tree should have tap items")
    assert.ok(oak!.tapItems[0].daysUntilReady > 0)
  })

  test("specialorders.json — count and board vs qi orders", () => {
    const { specialOrders } = readOutput<{ specialOrders: { id: string; requester: string; orderType: string; objectives: unknown[] }[] }>("specialorders.json")
    assert.ok(specialOrders.length >= 30, `expected ≥30 special orders, got ${specialOrders.length}`)
    const willy = specialOrders.find(o => o.id === "Willy")
    assert.ok(willy, "Willy order not found")
    assert.equal(willy!.requester, "Willy")
    assert.equal(willy!.orderType, "")
    const qi = specialOrders.filter(o => o.orderType === "Qi")
    assert.ok(qi.length >= 5, `expected ≥5 Qi challenges, got ${qi.length}`)
  })

  test("books.json — count and skill books present", () => {
    const { books } = readOutput<{ books: { id: string; name: string; sellPrice: number; contextTags: string[] }[] }>("books.json")
    assert.ok(books.length >= 20, `expected ≥20 books, got ${books.length}`)
    assert.ok(books.every(b => b.contextTags.includes("book_item")), "all books must have book_item tag")
    const xpBooks = books.filter(b => b.contextTags.some(t => t.startsWith("book_xp_")))
    assert.ok(xpBooks.length >= 5, `expected ≥5 xp books, got ${xpBooks.length}`)
  })

  test("furniture.json — count and tile size", () => {
    const { furniture } = readOutput<{ furniture: { id: string; name: string; type: string; tileSizeX: number; tileSizeY: number }[] }>("furniture.json")
    assert.ok(furniture.length >= 500, `expected ≥500 furniture, got ${furniture.length}`)
    const cactus = furniture.find(f => f.name === "Long Cactus")
    assert.ok(cactus, "Long Cactus not found")
    assert.equal(cactus!.tileSizeX, 1)
    assert.equal(cactus!.tileSizeY, 3)
    assert.equal(cactus!.type, "decor")
  })

  test("boots.json — count and stats", () => {
    const { boots } = readOutput<{ boots: { id: string; name: string; defense: number; immunity: number }[] }>("boots.json")
    assert.ok(boots.length >= 15, `expected ≥15 boots, got ${boots.length}`)
    const dark = boots.find(b => b.name === "Dark Boots")
    assert.ok(dark, "Dark Boots not found")
    assert.equal(dark!.defense, 4)
    assert.equal(dark!.immunity, 2)
  })

  test("bigcraftables.json — count and structure", () => {
    const { bigCraftables } = readOutput<{ bigCraftables: { id: string; name: string; isLamp: boolean; spriteIndex: number }[] }>("bigcraftables.json")
    assert.ok(bigCraftables.length >= 100, `expected ≥100 big craftables, got ${bigCraftables.length}`)
    const keg = bigCraftables.find(bc => bc.name === "Keg")
    assert.ok(keg, "Keg not found")
    assert.equal(keg!.isLamp, false)
    assert.ok(keg!.spriteIndex >= 0)
  })

  test("fences.json — count and structure", () => {
    const { fences } = readOutput<{ fences: { id: string; health: number; texture: string }[] }>("fences.json")
    assert.ok(fences.length >= 5, `expected ≥5 fences, got ${fences.length}`)
    const woodFence = fences.find(f => f.id === "322")
    assert.ok(woodFence, "wood fence (322) not found")
    assert.equal(woodFence!.health, 28)
    assert.ok(woodFence!.texture.includes("Fence"))
  })

  test("mannequins.json — count and structure", () => {
    const { mannequins } = readOutput<{ mannequins: { id: string; cursed: boolean; displaysClothingAsMale: boolean; sheetIndex: number }[] }>("mannequins.json")
    assert.ok(mannequins.length >= 4, `expected ≥4 mannequins, got ${mannequins.length}`)
    const male = mannequins.find(m => m.id === "MannequinMale")
    assert.ok(male, "MannequinMale not found")
    assert.equal(male!.cursed, false)
    assert.equal(male!.displaysClothingAsMale, true)
    assert.equal(male!.sheetIndex, 0)
  })

  test("garbagecans.json — count and structure", () => {
    const { garbageCans, defaultBaseChance } = readOutput<{ defaultBaseChance: number; garbageCans: { id: string; items: unknown[] }[] }>("garbagecans.json")
    assert.equal(defaultBaseChance, 0.2)
    assert.ok(garbageCans.length >= 4, `expected ≥4 garbage cans, got ${garbageCans.length}`)
    const evelyn = garbageCans.find(c => c.id === "Evelyn")
    assert.ok(evelyn, "Evelyn garbage can not found")
    assert.ok(evelyn!.items.length >= 1)
  })

  test("pets.json — count and structure", () => {
    const { pets } = readOutput<{ pets: { id: string; barkSound: string; moveSpeed: number }[] }>("pets.json")
    assert.ok(pets.length >= 3, `expected ≥3 pets, got ${pets.length}`)
    const cat = pets.find(p => p.id === "Cat")
    assert.ok(cat, "Cat pet not found")
    assert.equal(cat!.barkSound, "cat")
    assert.equal(cat!.moveSpeed, 2)
  })

  test("floorsandpaths.json — count and structure", () => {
    const { floorsAndPaths } = readOutput<{ floorsAndPaths: { id: string; itemId: string; connectType: string; farmSpeedBuff: number | null }[] }>("floorsandpaths.json")
    assert.ok(floorsAndPaths.length >= 12, `expected ≥12 floors/paths, got ${floorsAndPaths.length}`)
    const woodFloor = floorsAndPaths.find(f => f.id === "0")
    assert.ok(woodFloor, "floor 0 not found")
    assert.equal(woodFloor!.itemId, "328")
    assert.equal(woodFloor!.farmSpeedBuff, null)
  })

  test("buffs.json — count and structure", () => {
    const { buffs } = readOutput<{ buffs: { id: string; isDebuff: boolean; duration: number; effects: Record<string, number> | null }[] }>("buffs.json")
    assert.ok(buffs.length >= 25, `expected ≥25 buffs, got ${buffs.length}`)
    const debuff = buffs.find(b => b.id === "12")
    assert.ok(debuff, "buff 12 not found")
    assert.equal(debuff!.isDebuff, true)
    assert.ok(debuff!.effects !== null)
    assert.ok("Speed" in debuff!.effects!)
  })

  test("museumrewards.json — count and structure", () => {
    const { museumRewards } = readOutput<{ museumRewards: { id: string; rewardItemId: string | null; targetContextTags: unknown[] }[] }>("museumrewards.json")
    assert.ok(museumRewards.length >= 25, `expected ≥25 museum rewards, got ${museumRewards.length}`)
    const dwarf = museumRewards.find(r => r.id === "dwarf")
    assert.ok(dwarf, "dwarf reward not found")
    assert.equal(dwarf!.rewardItemId, "(O)326")
    assert.equal(dwarf!.targetContextTags.length, 4)
  })

  test("giantcrops.json — count and structure", () => {
    const { giantCrops } = readOutput<{ giantCrops: { id: string; fromItemId: string; spawnChance: number; harvestItems: unknown[] }[] }>("giantcrops.json")
    assert.ok(giantCrops.length >= 5, `expected ≥5 giant crops, got ${giantCrops.length}`)
    const cauliflower = giantCrops.find(g => g.id === "Cauliflower")
    assert.ok(cauliflower, "Cauliflower giant crop not found")
    assert.equal(cauliflower!.fromItemId, "(O)190")
    assert.equal(cauliflower!.spawnChance, 0.01)
    assert.equal(cauliflower!.harvestItems.length, 1)
  })

  test("achievements.json — count and structure", () => {
    const { achievements } = readOutput<{ achievements: { id: string; name: string; showProgressBar: boolean; prerequisiteId: number | null; spriteIndex: number }[] }>("achievements.json")
    assert.ok(achievements.length >= 35, `expected ≥35 achievements, got ${achievements.length}`)
    const greenhorn = achievements.find(a => a.id === "0")
    assert.ok(greenhorn, "Greenhorn achievement not found")
    assert.equal(greenhorn!.name, "Greenhorn (15k)")
    assert.equal(greenhorn!.showProgressBar, true)
    assert.equal(greenhorn!.prerequisiteId, null)
    assert.equal(greenhorn!.spriteIndex, 18)
  })

  test("all output files have _meta with gameVersion 1.6.15", () => {
    const files = [
      "objects.json", "crops.json", "fish.json", "npcs.json",
      "buildings.json", "monsters.json", "weapons.json", "bundles.json", "recipes.json",
      "tools.json", "fruittrees.json", "machines.json", "quests.json", "locations.json", "shops.json",
      "bigcraftables.json", "boots.json", "furniture.json", "books.json", "specialorders.json",
      "wildtrees.json", "hats.json", "clothing.json", "trinkets.json",
      "farmanimals.json", "fishponds.json", "monsterslayerquests.json", "tailoringrecipes.json",
      "achievements.json", "giantcrops.json", "museumrewards.json", "buffs.json", "floorsandpaths.json",
      "pets.json", "garbagecans.json", "mannequins.json", "fences.json",
    ]
    for (const file of files) {
      const data = readOutput<{ _meta: { gameVersion: string } }>(file)
      assert.equal(data._meta.gameVersion, "1.6.15", `${file} missing correct gameVersion`)
    }
  })
})
