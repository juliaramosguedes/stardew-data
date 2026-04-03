import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedShirt, ProcessedPants } from "../../../scripts/types.ts"
import type { RawShirt, RawPants } from "../../../scripts/types.ts"

type ShirtParseFn = (id: string, s: RawShirt) => ProcessedShirt
type PantsParseFn = (id: string, p: RawPants) => ProcessedPants

const OVERALLS: RawShirt = {
  Name: "Classic Overalls",
  DisplayName: "Classic Overalls",
  Description: "Sturdy overalls.",
  Price: 50,
  Texture: null,
  SpriteIndex: 0,
  DefaultColor: null,
  CanBeDyed: false,
  IsPrismatic: false,
  HasSleeves: true,
  CanChooseDuringCharacterCustomization: true,
  CustomFields: null,
}

const PRISMATIC_SHIRT: RawShirt = {
  Name: "Prismatic Shirt",
  DisplayName: "Prismatic Shirt",
  Description: "It shimmers.",
  Price: 2000,
  Texture: "TileSheets/shirts",
  SpriteIndex: 10,
  DefaultColor: null,
  CanBeDyed: false,
  IsPrismatic: true,
  HasSleeves: true,
  CanChooseDuringCharacterCustomization: true,
  CustomFields: null,
}

const FARMER_PANTS: RawPants = {
  Name: "Farmer Pants",
  DisplayName: "Farmer Pants",
  Description: "Standard issue.",
  Price: 50,
  Texture: null,
  SpriteIndex: 0,
  DefaultColor: "255 235 203",
  CanBeDyed: true,
  IsPrismatic: false,
  CanChooseDuringCharacterCustomization: true,
  CustomFields: null,
}

let parseShirtEntry: ShirtParseFn
let parsePantsEntry: PantsParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/clothing.ts")
  parseShirtEntry = mod.parseShirtEntry
  parsePantsEntry = mod.parsePantsEntry
})

describe("parseShirtEntry", () => {
  test("maps id, name and sellPrice", () => {
    const s = parseShirtEntry("1000", OVERALLS)
    assert.equal(s.id, "1000")
    assert.equal(s.name, "Classic Overalls")
    assert.equal(s.sellPrice, 50)
  })

  test("canBeDyed false for overalls", () => {
    const s = parseShirtEntry("1000", OVERALLS)
    assert.equal(s.canBeDyed, false)
    assert.equal(s.isPrismatic, false)
  })

  test("isPrismatic and texture preserved", () => {
    const s = parseShirtEntry("9999", PRISMATIC_SHIRT)
    assert.equal(s.isPrismatic, true)
    assert.equal(s.spriteSheet, "TileSheets/shirts")
  })

  test("hasSleeves preserved", () => {
    const s = parseShirtEntry("1000", OVERALLS)
    assert.equal(s.hasSleeves, true)
  })

  test("null texture maps to null spriteSheet", () => {
    const s = parseShirtEntry("1000", OVERALLS)
    assert.equal(s.spriteSheet, null)
  })
})

describe("parsePantsEntry", () => {
  test("maps id, name and sellPrice", () => {
    const p = parsePantsEntry("0", FARMER_PANTS)
    assert.equal(p.id, "0")
    assert.equal(p.name, "Farmer Pants")
    assert.equal(p.sellPrice, 50)
  })

  test("canBeDyed true for farmer pants", () => {
    const p = parsePantsEntry("0", FARMER_PANTS)
    assert.equal(p.canBeDyed, true)
  })

  test("defaultColor preserved", () => {
    const p = parsePantsEntry("0", FARMER_PANTS)
    assert.equal(p.defaultColor, "255 235 203")
  })
})
