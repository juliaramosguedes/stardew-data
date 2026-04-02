import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedBuilding } from "../../../scripts/types.ts"
import type { RawBuilding } from "../../../scripts/types.ts"

type ParseFn = (id: string, b: RawBuilding, lookup: Record<string, { Name: string }>) => ProcessedBuilding

const COOP: RawBuilding = {
  Name: "[LocalizedText Strings\\Buildings:Coop_Name]",
  Description: "A home for your chickens.",
  Texture: "Buildings/Coop",
  BuildCost: 4000,
  BuildMaterials: [
    { ItemId: "388", Amount: 300 },
    { ItemId: "709", Amount: 100 },
  ],
  BuildDays: 3,
  MagicalConstruction: false,
  Builder: "Robin",
  MaxOccupants: 4,
  HayCapacity: 0,
  CustomFields: null,
}

const LOOKUP = {
  "388": { Name: "Wood" },
  "709": { Name: "Hardwood" },
}

let parseBuildingEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/buildings.ts")
  parseBuildingEntry = mod.parseBuildingEntry
})

describe("parseBuildingEntry", () => {
  test("maps id and core fields", () => {
    const b = parseBuildingEntry("Coop", COOP, LOOKUP)
    assert.equal(b.id, "Coop")
    assert.equal(b.buildCost, 4000)
    assert.equal(b.buildDays, 3)
    assert.equal(b.maxOccupants, 4)
    assert.equal(b.hayCapacity, 0)
    assert.equal(b.builder, "Robin")
    assert.equal(b.isMagical, false)
    assert.equal(b.texture, "Buildings/Coop")
  })

  test("resolves material names from lookup", () => {
    const b = parseBuildingEntry("Coop", COOP, LOOKUP)
    assert.equal(b.buildMaterials.length, 2)
    assert.deepEqual(b.buildMaterials[0], { itemId: "388", amount: 300, name: "Wood" })
    assert.deepEqual(b.buildMaterials[1], { itemId: "709", amount: 100, name: "Hardwood" })
  })

  test("falls back to itemId when not in lookup", () => {
    const b = parseBuildingEntry("Coop", COOP, {})
    assert.equal(b.buildMaterials[0].name, "388")
  })

  test("handles null BuildMaterials as empty array", () => {
    const b = parseBuildingEntry("Pet Bowl", { ...COOP, BuildMaterials: null }, LOOKUP)
    assert.deepEqual(b.buildMaterials, [])
  })
})
