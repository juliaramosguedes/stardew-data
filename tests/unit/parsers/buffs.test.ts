import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { RawBuff } from "../../../scripts/types.ts"

type ParseFn = (id: string, b: RawBuff) => {
  id: string
  displayName: string
  description: string | null
  isDebuff: boolean
  duration: number
  iconTexture: string
  iconSpriteIndex: number
  effects: Record<string, number> | null
}

const DEBUFF: RawBuff = {
  DisplayName: "[LocalizedText Strings\\StringsFromCSFiles:Buff.cs.453]",
  Description: null,
  IsDebuff: true,
  GlowColor: "Yellow",
  Duration: 6000,
  MaxDuration: -1,
  IconTexture: "TileSheets\\BuffsIcons",
  IconSpriteIndex: 12,
  Effects: { Speed: -2.0, Defense: -3.0, Attack: -3.0 },
  ActionsOnApply: null,
  CustomFields: null,
}

const NO_EFFECTS: RawBuff = {
  DisplayName: "[LocalizedText Strings\\StringsFromCSFiles:Buff.cs.456]",
  Description: null,
  IsDebuff: false,
  GlowColor: null,
  Duration: 180000,
  MaxDuration: -1,
  IconTexture: "TileSheets\\BuffsIcons",
  IconSpriteIndex: 6,
  Effects: null,
  ActionsOnApply: null,
  CustomFields: null,
}

let parseBuffEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/buffs.ts")
  parseBuffEntry = mod.parseBuffEntry
})

describe("parseBuffEntry", () => {
  test("maps id, isDebuff, and duration", () => {
    const b = parseBuffEntry("12", DEBUFF)
    assert.equal(b.id, "12")
    assert.equal(b.isDebuff, true)
    assert.equal(b.duration, 6000)
  })

  test("maps iconSpriteIndex and iconTexture", () => {
    const b = parseBuffEntry("12", DEBUFF)
    assert.equal(b.iconSpriteIndex, 12)
    assert.equal(b.iconTexture, "TileSheets\\BuffsIcons")
  })

  test("effects object preserved when present", () => {
    const b = parseBuffEntry("12", DEBUFF)
    assert.ok(b.effects !== null)
    assert.equal(b.effects!["Speed"], -2.0)
    assert.equal(b.effects!["Defense"], -3.0)
  })

  test("effects null when absent", () => {
    const b = parseBuffEntry("6", NO_EFFECTS)
    assert.equal(b.effects, null)
    assert.equal(b.isDebuff, false)
  })

  test("description is null when not provided", () => {
    const b = parseBuffEntry("6", NO_EFFECTS)
    assert.equal(b.description, null)
  })
})
