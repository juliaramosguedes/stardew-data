import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { RawMannequin } from "../../../scripts/types.ts"

type ParseFn = (id: string, m: RawMannequin) => {
  id: string
  displayName: string
  description: string
  texture: string
  sheetIndex: number
  displaysClothingAsMale: boolean
  cursed: boolean
}

const MALE: RawMannequin = {
  DisplayName: "[LocalizedText Strings\\1_6_Strings:MannequinMale_Name]",
  Description: "[LocalizedText Strings\\1_6_Strings:Mannequin_Description]",
  Texture: "TileSheets\\Mannequins",
  FarmerTexture: "Characters/Farmer/farmer_base_mannequin",
  SheetIndex: 0,
  DisplaysClothingAsMale: true,
  Cursed: false,
  CustomFields: null,
}

const CURSED_FEMALE: RawMannequin = {
  DisplayName: "[LocalizedText Strings\\1_6_Strings:CursedMannequinDemale_Name]",
  Description: "[LocalizedText Strings\\1_6_Strings:CursedMannequin_Description]",
  Texture: "TileSheets\\Mannequins",
  FarmerTexture: "Characters/Farmer/farmer_girl_mannequin_cursed",
  SheetIndex: 12,
  DisplaysClothingAsMale: false,
  Cursed: true,
  CustomFields: null,
}

let parseMannequinEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/mannequins.ts")
  parseMannequinEntry = mod.parseMannequinEntry
})

describe("parseMannequinEntry", () => {
  test("maps id, sheetIndex, and displaysClothingAsMale", () => {
    const m = parseMannequinEntry("MannequinMale", MALE)
    assert.equal(m.id, "MannequinMale")
    assert.equal(m.sheetIndex, 0)
    assert.equal(m.displaysClothingAsMale, true)
  })

  test("cursed false for normal mannequin", () => {
    const m = parseMannequinEntry("MannequinMale", MALE)
    assert.equal(m.cursed, false)
  })

  test("cursed female has correct flags", () => {
    const m = parseMannequinEntry("CursedMannequinFemale", CURSED_FEMALE)
    assert.equal(m.cursed, true)
    assert.equal(m.displaysClothingAsMale, false)
    assert.equal(m.sheetIndex, 12)
  })
})
