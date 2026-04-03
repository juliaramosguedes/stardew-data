import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedFruitTree } from "../../../scripts/types.ts"
import type { RawFruitTree } from "../../../scripts/types.ts"
import type { ObjectLookup } from "../../../scripts/utils/game.ts"

type ParseFn = (id: string, t: RawFruitTree, lookup: ObjectLookup) => ProcessedFruitTree

const CHERRY_TREE: RawFruitTree = {
  Seasons: ["Spring"],
  DaysUntilMature: 28,
  Fruit: [{ ItemId: "(O)634", Chance: 1, Season: null }],
  Texture: null,
  TextureSpriteRow: 0,
  CustomFields: null,
}

const APPLE_TREE: RawFruitTree = {
  Seasons: ["Fall"],
  DaysUntilMature: 28,
  Fruit: [{ ItemId: "(O)613", Chance: 1, Season: "Fall" }],
  Texture: null,
  TextureSpriteRow: 3,
  CustomFields: null,
}

const LOOKUP: ObjectLookup = {
  "628": { Name: "Cherry Sapling" },
  "634": { Name: "Cherry" },
  "613": { Name: "Apple" },
}

let parseFruitTreeEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/fruittrees.ts")
  parseFruitTreeEntry = mod.parseFruitTreeEntry
})

describe("parseFruitTreeEntry", () => {
  test("maps seasons and growth days", () => {
    const t = parseFruitTreeEntry("628", CHERRY_TREE, LOOKUP)
    assert.deepEqual(t.seasons, ["Spring"])
    assert.equal(t.daysUntilMature, 28)
    assert.equal(t.spriteRow, 0)
  })

  test("resolves seed name from lookup", () => {
    const t = parseFruitTreeEntry("628", CHERRY_TREE, LOOKUP)
    assert.equal(t.id, "628")
    assert.equal(t.name, "Cherry Sapling")
  })

  test("resolves fruit name by stripping (O) prefix", () => {
    const t = parseFruitTreeEntry("628", CHERRY_TREE, LOOKUP)
    assert.equal(t.fruit.length, 1)
    assert.deepEqual(t.fruit[0], { itemId: "(O)634", name: "Cherry", chance: 1, season: null })
  })

  test("preserves seasonal fruit restriction", () => {
    const t = parseFruitTreeEntry("628", APPLE_TREE, LOOKUP)
    assert.equal(t.fruit[0].season, "Fall")
  })

  test("falls back to id when sapling not in lookup", () => {
    const t = parseFruitTreeEntry("999", CHERRY_TREE, {})
    assert.equal(t.name, "999")
  })
})
