import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const PROCESSED = path.join(process.cwd(), "processed")
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

  test("all output files have _meta with gameVersion 1.6.15", () => {
    const files = ["objects.json", "crops.json", "fish.json", "npcs.json",
                   "buildings.json", "monsters.json", "weapons.json", "bundles.json", "recipes.json"]
    for (const file of files) {
      const data = readOutput<{ _meta: { gameVersion: string } }>(file)
      assert.equal(data._meta.gameVersion, "1.6.15", `${file} missing correct gameVersion`)
    }
  })
})
