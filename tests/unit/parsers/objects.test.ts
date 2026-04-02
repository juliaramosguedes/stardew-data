import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedObject } from "../../../scripts/types.ts"
import type { RawObject } from "../../../scripts/types.ts"

type ParseFn = (id: string, obj: RawObject) => ProcessedObject

const OBJ: RawObject = {
  Name: "Parsnip",
  DisplayName: "Parsnip",
  Description: "A spring tuber closely related to the carrot.",
  Type: "Basic",
  Category: -75,
  Price: 35,
  Texture: null,
  SpriteIndex: 24,
  Edibility: 10,
  IsDrink: false,
  Buffs: null,
  ContextTags: ["veggie_item", "spring_item"],
  CanBeGivenAsGift: true,
  ExcludeFromShippingCollection: false,
  CustomFields: null,
}

let parseObjectEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/objects.ts")
  parseObjectEntry = mod.parseObjectEntry
})

describe("parseObjectEntry", () => {
  test("maps id and core fields", () => {
    const o = parseObjectEntry("24", OBJ)
    assert.equal(o.id, "24")
    assert.equal(o.name, "Parsnip")
    assert.equal(o.type, "Basic")
    assert.equal(o.category, -75)
    assert.equal(o.sellPrice, 35)
    assert.equal(o.edibility, 10)
  })

  test("maps boolean flags", () => {
    const o = parseObjectEntry("24", OBJ)
    assert.equal(o.isDrink, false)
    assert.equal(o.canBeGivenAsGift, true)
    assert.equal(o.excludeFromShipping, false)
  })

  test("maps sprite fields", () => {
    const o = parseObjectEntry("24", OBJ)
    assert.equal(o.spriteIndex, 24)
    assert.equal(o.spriteSheet, null)
  })

  test("maps contextTags array", () => {
    const o = parseObjectEntry("24", OBJ)
    assert.deepEqual(o.contextTags, ["veggie_item", "spring_item"])
  })

  test("defaults null contextTags to empty array", () => {
    const o = parseObjectEntry("24", { ...OBJ, ContextTags: null })
    assert.deepEqual(o.contextTags, [])
  })
})
