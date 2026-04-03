import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { RawGarbageCan } from "../../../scripts/types.ts"

type ParseFn = (id: string, can: RawGarbageCan) => {
  id: string
  baseChance: number | null
  items: Array<{ id: string; itemId: string | null; condition: string | null }>
}

const EVELYN_CAN: RawGarbageCan = {
  BaseChance: -1.0,
  Items: [
    { Id: "Base_Cookie", ItemId: "(O)223", Condition: "RANDOM 0.2 @addDailyLuck",
      IgnoreBaseChance: false, IsMegaSuccess: false, IsDoubleMegaSuccess: false,
      AddToInventoryDirectly: false, CreateMultipleDebris: false,
      RandomItemId: null, MaxItems: null, MinStack: -1, MaxStack: -1, Quality: -1,
      IsRecipe: false, StackModifiers: null, StackModifierMode: "Stack",
      QualityModifiers: null, QualityModifierMode: "Stack",
      ModData: null, PerItemCondition: null,
      ObjectInternalName: null, ObjectDisplayName: null, ObjectColor: null,
      ToolUpgradeLevel: -1,
    },
  ],
  CustomFields: null,
}

const EMPTY_CAN: RawGarbageCan = {
  BaseChance: -1.0,
  Items: [],
  CustomFields: null,
}

let parseGarbageCanEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/garbagecans.ts")
  parseGarbageCanEntry = mod.parseGarbageCanEntry
})

describe("parseGarbageCanEntry", () => {
  test("maps id and items", () => {
    const c = parseGarbageCanEntry("Evelyn", EVELYN_CAN)
    assert.equal(c.id, "Evelyn")
    assert.equal(c.items.length, 1)
    assert.equal(c.items[0].itemId, "(O)223")
  })

  test("baseChance -1 maps to null", () => {
    const c = parseGarbageCanEntry("Evelyn", EVELYN_CAN)
    assert.equal(c.baseChance, null)
  })

  test("empty items array", () => {
    const c = parseGarbageCanEntry("Mayor", EMPTY_CAN)
    assert.equal(c.items.length, 0)
  })

  test("item condition is preserved", () => {
    const c = parseGarbageCanEntry("Evelyn", EVELYN_CAN)
    assert.equal(c.items[0].condition, "RANDOM 0.2 @addDailyLuck")
  })
})
