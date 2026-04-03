import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedBook } from "../../../scripts/types.ts"
import type { RawObject } from "../../../scripts/types.ts"

type ParseFn = (id: string, obj: RawObject) => ProcessedBook

const SKILL_BOOK: RawObject = {
  Name: "Stardew Valley Almanac",
  DisplayName: "Stardew Valley Almanac",
  Description: "A comprehensive farming guide.",
  Type: "asdf",
  Category: -102,
  Price: 500,
  Texture: null,
  SpriteIndex: 0,
  Edibility: -300,
  IsDrink: false,
  Buffs: null,
  ContextTags: ["color_gold", "book_item"],
  CanBeGivenAsGift: false,
  ExcludeFromShippingCollection: false,
  CustomFields: null,
}

const XP_BOOK: RawObject = {
  Name: "The Alleyway Buffet",
  DisplayName: "The Alleyway Buffet",
  Description: "Increase your foraging XP.",
  Type: "asdf",
  Category: -102,
  Price: 3000,
  Texture: null,
  SpriteIndex: 1,
  Edibility: -300,
  IsDrink: false,
  Buffs: null,
  ContextTags: ["color_dark_gray", "book_item", "book_xp_foraging"],
  CanBeGivenAsGift: false,
  ExcludeFromShippingCollection: false,
  CustomFields: null,
}

let parseBookEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/books.ts")
  parseBookEntry = mod.parseBookEntry
})

describe("parseBookEntry", () => {
  test("maps id, name and sellPrice", () => {
    const b = parseBookEntry("SkillBook_0", SKILL_BOOK)
    assert.equal(b.id, "SkillBook_0")
    assert.equal(b.name, "Stardew Valley Almanac")
    assert.equal(b.sellPrice, 500)
  })

  test("preserves contextTags", () => {
    const b = parseBookEntry("SkillBook_0", SKILL_BOOK)
    assert.deepEqual(b.contextTags, ["color_gold", "book_item"])
  })

  test("xp book contextTags include skill", () => {
    const b = parseBookEntry("Book_Trash", XP_BOOK)
    assert.ok(b.contextTags.includes("book_xp_foraging"))
  })

  test("sellPrice preserved for expensive book", () => {
    const b = parseBookEntry("Book_Trash", XP_BOOK)
    assert.equal(b.sellPrice, 3000)
  })
})
