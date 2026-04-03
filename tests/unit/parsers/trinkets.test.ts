import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedTrinket } from "../../../scripts/types.ts"
import type { RawTrinket } from "../../../scripts/types.ts"

type ParseFn = (id: string, t: RawTrinket) => ProcessedTrinket

const FROG_EGG: RawTrinket = {
  DisplayName: "[LocalizedText Strings\\1_6_Strings:FrogEgg_Name]",
  Description: "[LocalizedText Strings\\1_6_Strings:FrogEgg_Description]",
  Texture: "TileSheets\\Objects_2",
  SheetIndex: 2,
  TrinketEffectClass: "StardewValley.Objects.Trinkets.CompanionTrinketEffect",
  DropsNaturally: true,
  CanBeReforged: true,
  CustomFields: null,
}

const MAGIC_HAIR_DYE: RawTrinket = {
  DisplayName: "[LocalizedText Strings\\1_6_Strings:MagicHairDye_Name]",
  Description: "[LocalizedText Strings\\1_6_Strings:MagicHairDye_Description]",
  Texture: "TileSheets\\Objects_2",
  SheetIndex: 1,
  TrinketEffectClass: "StardewValley.Objects.Trinkets.RainbowHairTrinketEffect",
  DropsNaturally: false,
  CanBeReforged: false,
  CustomFields: null,
}

let parseTrinketEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/trinkets.ts")
  parseTrinketEntry = mod.parseTrinketEntry
})

describe("parseTrinketEntry", () => {
  test("maps id and texture", () => {
    const t = parseTrinketEntry("FrogEgg", FROG_EGG)
    assert.equal(t.id, "FrogEgg")
    assert.equal(t.texture, "TileSheets\\Objects_2")
  })

  test("maps sheetIndex", () => {
    const t = parseTrinketEntry("FrogEgg", FROG_EGG)
    assert.equal(t.sheetIndex, 2)
  })

  test("effectClass preserved", () => {
    const t = parseTrinketEntry("FrogEgg", FROG_EGG)
    assert.equal(t.effectClass, "StardewValley.Objects.Trinkets.CompanionTrinketEffect")
  })

  test("dropsNaturally true for frog egg", () => {
    const t = parseTrinketEntry("FrogEgg", FROG_EGG)
    assert.equal(t.dropsNaturally, true)
    assert.equal(t.canBeReforged, true)
  })

  test("dropsNaturally false for magic hair dye", () => {
    const t = parseTrinketEntry("MagicHairDye", MAGIC_HAIR_DYE)
    assert.equal(t.dropsNaturally, false)
    assert.equal(t.canBeReforged, false)
  })
})
