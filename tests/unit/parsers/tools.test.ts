import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedTool } from "../../../scripts/types.ts"
import type { RawTool } from "../../../scripts/types.ts"

type ParseFn = (id: string, t: RawTool) => ProcessedTool

const AXE: RawTool = {
  Name: "Axe",
  SalePrice: 0,
  Texture: null,
  SpriteIndex: 2,
  UpgradeLevel: 0,
  ConventionalUpgradeFrom: null,
  CustomFields: null,
}

const COPPER_AXE: RawTool = {
  Name: "Copper Axe",
  SalePrice: 2000,
  Texture: null,
  SpriteIndex: 6,
  UpgradeLevel: 1,
  ConventionalUpgradeFrom: "Axe",
  CustomFields: null,
}

let parseToolEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/tools.ts")
  parseToolEntry = mod.parseToolEntry
})

describe("parseToolEntry", () => {
  test("maps id and core fields", () => {
    const t = parseToolEntry("Axe", AXE)
    assert.equal(t.id, "Axe")
    assert.equal(t.name, "Axe")
    assert.equal(t.upgradeLevel, 0)
    assert.equal(t.salePrice, 0)
    assert.equal(t.spriteIndex, 2)
    assert.equal(t.texture, null)
    assert.equal(t.upgradeFrom, null)
  })

  test("maps upgrade chain", () => {
    const t = parseToolEntry("CopperAxe", COPPER_AXE)
    assert.equal(t.upgradeLevel, 1)
    assert.equal(t.salePrice, 2000)
    assert.equal(t.upgradeFrom, "Axe")
  })

  test("preserves texture when present", () => {
    const t = parseToolEntry("Watering Can", { ...AXE, Texture: "TileSheets/Tools" })
    assert.equal(t.texture, "TileSheets/Tools")
  })
})
