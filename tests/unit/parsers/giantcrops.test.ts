import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { RawGiantCrop } from "../../../scripts/types.ts"

type ParseFn = (id: string, g: RawGiantCrop, lookup: Record<string, { Name: string }>) => {
  id: string
  fromItemId: string
  fromItemName: string
  harvestItems: Array<{ itemId: string; name: string; minStack: number; maxStack: number; chance: number }>
  spawnChance: number
  health: number
}

const LOOKUP = { "190": { Name: "Cauliflower" }, "254": { Name: "Melon" } }

const CAULIFLOWER: RawGiantCrop = {
  FromItemId: "(O)190",
  HarvestItems: [
    { ItemId: "(O)190", MinStack: 15, MaxStack: 21, Chance: 1.0,
      Id: "(O)190", Condition: null, RandomItemId: null, MaxItems: null,
      Quality: -1, IsRecipe: false, ToolUpgradeLevel: -1, ForShavingEnchantment: null,
      ScaledMinStackWhenShaving: 2, ScaledMaxStackWhenShaving: 2,
      StackModifiers: null, StackModifierMode: "Stack", QualityModifiers: null,
      QualityModifierMode: "Stack", ModData: null, PerItemCondition: null,
      ObjectInternalName: null, ObjectDisplayName: null, ObjectColor: null,
    },
  ],
  Texture: "TileSheets\\Crops",
  TexturePosition: { X: 112, Y: 512 },
  TileSize: { X: 3, Y: 3 },
  Health: 3,
  Chance: 0.01,
  Condition: null,
  CustomFields: null,
}

let parseGiantCropEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/giantcrops.ts")
  parseGiantCropEntry = mod.parseGiantCropEntry
})

describe("parseGiantCropEntry", () => {
  test("maps id and fromItemId", () => {
    const g = parseGiantCropEntry("Cauliflower", CAULIFLOWER, LOOKUP)
    assert.equal(g.id, "Cauliflower")
    assert.equal(g.fromItemId, "(O)190")
  })

  test("resolves fromItemName via lookup", () => {
    const g = parseGiantCropEntry("Cauliflower", CAULIFLOWER, LOOKUP)
    assert.equal(g.fromItemName, "Cauliflower")
  })

  test("maps spawnChance and health", () => {
    const g = parseGiantCropEntry("Cauliflower", CAULIFLOWER, LOOKUP)
    assert.equal(g.spawnChance, 0.01)
    assert.equal(g.health, 3)
  })

  test("harvestItems mapped correctly", () => {
    const g = parseGiantCropEntry("Cauliflower", CAULIFLOWER, LOOKUP)
    assert.equal(g.harvestItems.length, 1)
    assert.equal(g.harvestItems[0].itemId, "(O)190")
    assert.equal(g.harvestItems[0].name, "Cauliflower")
    assert.equal(g.harvestItems[0].minStack, 15)
    assert.equal(g.harvestItems[0].maxStack, 21)
    assert.equal(g.harvestItems[0].chance, 1.0)
  })
})
