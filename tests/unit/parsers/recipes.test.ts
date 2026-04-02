import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedRecipe } from "../../../scripts/types.ts"
import type { ObjectLookup } from "../../../scripts/utils/game.ts"

type ParseFn = (id: string, raw: string, lookup: ObjectLookup, type: "cooking" | "crafting") => ProcessedRecipe

const lookup: ObjectLookup = {
  "194": { Name: "Fried Egg" },
  "322": { Name: "Wood Fence" },
  "388": { Name: "Wood" },
}

let parseRecipeEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/recipes.ts")
  parseRecipeEntry = mod.parseRecipeEntry
})

describe("parseRecipeEntry — cooking", () => {
  const RAW = "-5 1/10 10/194/default/"

  test("sets type and name", () => {
    const r = parseRecipeEntry("Fried Egg", RAW, lookup, "cooking")
    assert.equal(r.id, "Fried Egg")
    assert.equal(r.name, "Fried Egg")
    assert.equal(r.type, "cooking")
  })

  test("parses output item and stack", () => {
    const r = parseRecipeEntry("Fried Egg", RAW, lookup, "cooking")
    assert.equal(r.outputItemId, "194")
    assert.equal(r.outputItemName, "Fried Egg")
    assert.equal(r.outputStack, 1)
  })

  test("parses unlock condition", () => {
    const r = parseRecipeEntry("Fried Egg", RAW, lookup, "cooking")
    assert.equal(r.unlockCondition, "default")
  })
})

describe("parseRecipeEntry — crafting", () => {
  const RAW = "388 2/Field/322/false/default/"

  test("sets type and parses output", () => {
    const r = parseRecipeEntry("Wood Fence", RAW, lookup, "crafting")
    assert.equal(r.type, "crafting")
    assert.equal(r.outputItemId, "322")
    assert.equal(r.outputItemName, "Wood Fence")
    assert.equal(r.outputStack, 1)
  })

  test("parses ingredients with name lookup", () => {
    const r = parseRecipeEntry("Wood Fence", RAW, lookup, "crafting")
    assert.equal(r.ingredients.length, 1)
    assert.deepEqual(r.ingredients[0], { itemId: "388", name: "Wood", amount: 2 })
  })
})
