import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedTailoringRecipe } from "../../../scripts/types.ts"
import type { RawTailoringRecipe } from "../../../scripts/types.ts"

type ParseFn = (r: RawTailoringRecipe) => ProcessedTailoringRecipe

const OSTRICH_HAT: RawTailoringRecipe = {
  Id: "(H)93",
  FirstItemTags: ["item_cloth"],
  SecondItemTags: ["item_ostrich_egg"],
  SpendRightItem: true,
  CraftedItemId: "(H)93",
  CraftedItemIds: null,
  CraftedItemIdFeminine: null,
}

const DINO_PANTS: RawTailoringRecipe = {
  Id: "(P)5",
  FirstItemTags: ["item_cloth"],
  SecondItemTags: ["item_dinosaur_mayonnaise"],
  SpendRightItem: true,
  CraftedItemId: "(P)5",
  CraftedItemIds: null,
  CraftedItemIdFeminine: null,
}

const NO_OUTPUT: RawTailoringRecipe = {
  Id: "empty",
  FirstItemTags: null,
  SecondItemTags: null,
  SpendRightItem: false,
  CraftedItemId: null,
  CraftedItemIds: null,
  CraftedItemIdFeminine: null,
}

let parseTailoringRecipeEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/tailoringrecipes.ts")
  parseTailoringRecipeEntry = mod.parseTailoringRecipeEntry
})

describe("parseTailoringRecipeEntry", () => {
  test("maps id and crafted item", () => {
    const r = parseTailoringRecipeEntry(OSTRICH_HAT)
    assert.equal(r.id, "(H)93")
    assert.equal(r.craftedItemId, "(H)93")
  })

  test("maps firstItemTags and secondItemTags", () => {
    const r = parseTailoringRecipeEntry(OSTRICH_HAT)
    assert.deepEqual(r.firstItemTags, ["item_cloth"])
    assert.deepEqual(r.secondItemTags, ["item_ostrich_egg"])
  })

  test("spendRightItem true means catalyst is consumed", () => {
    const r = parseTailoringRecipeEntry(OSTRICH_HAT)
    assert.equal(r.spendRightItem, true)
  })

  test("pants recipe correctly mapped", () => {
    const r = parseTailoringRecipeEntry(DINO_PANTS)
    assert.equal(r.craftedItemId, "(P)5")
    assert.ok(r.secondItemTags.includes("item_dinosaur_mayonnaise"))
  })

  test("null tags map to empty arrays", () => {
    const r = parseTailoringRecipeEntry(NO_OUTPUT)
    assert.deepEqual(r.firstItemTags, [])
    assert.deepEqual(r.secondItemTags, [])
    assert.equal(r.craftedItemId, null)
  })
})
