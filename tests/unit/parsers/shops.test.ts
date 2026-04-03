import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedShop } from "../../../scripts/types.ts"
import type { ObjectLookup } from "../../../scripts/utils/game.ts"

type RawShop = {
  Owners?: { Id: string; [k: string]: unknown }[]
  Items?: { ItemId: string; Price?: number; AvailableStock?: number; [k: string]: unknown }[]
}
type ParseFn = (id: string, shop: RawShop, lookup: ObjectLookup) => ProcessedShop

const FISH_SHOP: RawShop = {
  Owners: [{ Id: "Willy" }],
  Items: [
    { ItemId: "(O)145", Price: 600, AvailableStock: -1 },
    { ItemId: "(O)128", Price: 200, AvailableStock: 1 },
    { ItemId: "ITEMS_LOST_ON_DEATH", Price: -1, AvailableStock: -1 },
  ],
}

const ADVENTURE_SHOP: RawShop = {
  Owners: [{ Id: "Marlon" }, { Id: "Gil" }],
  Items: [
    { ItemId: "(W)4", Price: 2000, AvailableStock: 1 },
  ],
}

const EMPTY_SHOP: RawShop = {}

const LOOKUP: ObjectLookup = {
  "145": { Name: "Sunfish" },
  "128": { Name: "Pufferfish" },
}

let parseShopEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/shops.ts")
  parseShopEntry = mod.parseShopEntry
})

describe("parseShopEntry", () => {
  test("maps id and owner ids", () => {
    const s = parseShopEntry("FishShop", FISH_SHOP, LOOKUP)
    assert.equal(s.id, "FishShop")
    assert.deepEqual(s.owners, ["Willy"])
  })

  test("supports multiple owners", () => {
    const s = parseShopEntry("AdventureShop", ADVENTURE_SHOP, LOOKUP)
    assert.deepEqual(s.owners, ["Marlon", "Gil"])
  })

  test("filters out items without parenthesized prefix", () => {
    const s = parseShopEntry("FishShop", FISH_SHOP, LOOKUP)
    assert.equal(s.items.length, 2)
    assert.ok(s.items.every(i => i.itemId.startsWith("(")))
  })

  test("resolves item names by stripping prefix", () => {
    const s = parseShopEntry("FishShop", FISH_SHOP, LOOKUP)
    const sunfish = s.items.find(i => i.itemId === "(O)145")
    assert.ok(sunfish)
    assert.equal(sunfish!.name, "Sunfish")
    assert.equal(sunfish!.price, 600)
    assert.equal(sunfish!.stock, -1)
  })

  test("falls back to itemId when not in lookup", () => {
    const s = parseShopEntry("AdventureShop", ADVENTURE_SHOP, {})
    assert.equal(s.items[0].name, "(W)4")
  })

  test("handles missing Owners and Items as empty arrays", () => {
    const s = parseShopEntry("Empty", EMPTY_SHOP, LOOKUP)
    assert.deepEqual(s.owners, [])
    assert.deepEqual(s.items, [])
  })
})
