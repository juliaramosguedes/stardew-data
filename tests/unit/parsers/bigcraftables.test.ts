import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedBigCraftable } from "../../../scripts/types.ts"
import type { RawBigCraftable } from "../../../scripts/types.ts"

type ParseFn = (id: string, bc: RawBigCraftable) => ProcessedBigCraftable

const KEG: RawBigCraftable = {
  Name: "Keg",
  Price: 50,
  Fragility: 0,
  CanBePlacedOutdoors: true,
  CanBePlacedIndoors: true,
  IsLamp: false,
  Texture: null,
  SpriteIndex: 12,
  ContextTags: null,
  CustomFields: null,
}

const LAMP: RawBigCraftable = {
  Name: "Torch",
  Price: 5,
  Fragility: 0,
  CanBePlacedOutdoors: true,
  CanBePlacedIndoors: true,
  IsLamp: true,
  Texture: "TileSheets/Craftables",
  SpriteIndex: 4,
  ContextTags: ["light_source"],
  CustomFields: null,
}

let parseBigCraftableEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/bigcraftables.ts")
  parseBigCraftableEntry = mod.parseBigCraftableEntry
})

describe("parseBigCraftableEntry", () => {
  test("maps id and core fields", () => {
    const bc = parseBigCraftableEntry("12", KEG)
    assert.equal(bc.id, "12")
    assert.equal(bc.name, "Keg")
    assert.equal(bc.sellPrice, 50)
    assert.equal(bc.spriteIndex, 12)
    assert.equal(bc.spriteSheet, null)
    assert.equal(bc.fragility, 0)
  })

  test("placement flags are preserved", () => {
    const bc = parseBigCraftableEntry("12", KEG)
    assert.equal(bc.canBePlacedOutdoors, true)
    assert.equal(bc.canBePlacedIndoors, true)
  })

  test("isLamp false for non-lamp", () => {
    const bc = parseBigCraftableEntry("12", KEG)
    assert.equal(bc.isLamp, false)
  })

  test("isLamp true and texture preserved", () => {
    const bc = parseBigCraftableEntry("4", LAMP)
    assert.equal(bc.isLamp, true)
    assert.equal(bc.spriteSheet, "TileSheets/Craftables")
  })

  test("null contextTags maps to empty array", () => {
    const bc = parseBigCraftableEntry("12", KEG)
    assert.deepEqual(bc.contextTags, [])
  })

  test("contextTags array is preserved", () => {
    const bc = parseBigCraftableEntry("4", LAMP)
    assert.deepEqual(bc.contextTags, ["light_source"])
  })
})
