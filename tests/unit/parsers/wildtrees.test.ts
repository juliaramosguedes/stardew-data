import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedWildTree } from "../../../scripts/types.ts"
import type { RawWildTree } from "../../../scripts/types.ts"

type ParseFn = (id: string, t: RawWildTree, lookup: Record<string, { Name: string }>) => ProcessedWildTree

const OAK_TREE: RawWildTree = {
  SeedItemId: "(O)309",
  SeedPlantable: true,
  GrowthChance: 0.2,
  TapItems: [
    { ItemId: "(O)725", DaysUntilReady: 7, Chance: 1, Id: "Default" },
  ],
  CustomFields: null,
}

const MUSHROOM_TREE: RawWildTree = {
  SeedItemId: "(O)891",
  SeedPlantable: true,
  GrowthChance: 0.2,
  TapItems: null,
  CustomFields: null,
}

const LOOKUP = {
  "309": { Name: "Acorn" },
  "725": { Name: "Oak Resin" },
  "891": { Name: "Mushroom Tree Seed" },
}

let parseWildTreeEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/wildtrees.ts")
  parseWildTreeEntry = mod.parseWildTreeEntry
})

describe("parseWildTreeEntry", () => {
  test("maps id and seedItemId", () => {
    const t = parseWildTreeEntry("1", OAK_TREE, LOOKUP)
    assert.equal(t.id, "1")
    assert.equal(t.seedItemId, "(O)309")
  })

  test("seedName resolved from lookup", () => {
    const t = parseWildTreeEntry("1", OAK_TREE, LOOKUP)
    assert.equal(t.seedName, "Acorn")
  })

  test("growthChance preserved", () => {
    const t = parseWildTreeEntry("1", OAK_TREE, LOOKUP)
    assert.equal(t.growthChance, 0.2)
  })

  test("tap items mapped with name from lookup", () => {
    const t = parseWildTreeEntry("1", OAK_TREE, LOOKUP)
    assert.equal(t.tapItems.length, 1)
    assert.equal(t.tapItems[0].itemId, "(O)725")
    assert.equal(t.tapItems[0].name, "Oak Resin")
    assert.equal(t.tapItems[0].daysUntilReady, 7)
  })

  test("null tapItems maps to empty array", () => {
    const t = parseWildTreeEntry("7", MUSHROOM_TREE, LOOKUP)
    assert.deepEqual(t.tapItems, [])
  })
})
