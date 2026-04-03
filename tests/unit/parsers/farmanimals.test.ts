import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedFarmAnimal } from "../../../scripts/types.ts"
import type { RawFarmAnimal } from "../../../scripts/types.ts"

type ParseFn = (id: string, a: RawFarmAnimal, lookup: Record<string, { Name: string }>) => ProcessedFarmAnimal

const CHICKEN: RawFarmAnimal = {
  House: "Coop",
  Gender: "Female",
  PurchasePrice: 400,
  SellPrice: 800,
  ProduceItemIds: [
    { Id: "Default", ItemId: "176", Condition: null, MinimumFriendship: 0 },
  ],
  CustomFields: null,
}

const PIG: RawFarmAnimal = {
  House: "Barn",
  Gender: "Male",
  PurchasePrice: 8000,
  SellPrice: 16000,
  ProduceItemIds: [
    { Id: "Default", ItemId: "430", Condition: null, MinimumFriendship: 0 },
  ],
  CustomFields: null,
}

const VOID_CHICKEN: RawFarmAnimal = {
  House: "Coop",
  Gender: "Female",
  PurchasePrice: -1,
  SellPrice: 800,
  ProduceItemIds: null,
  CustomFields: null,
}

const LOOKUP = {
  "176": { Name: "Egg" },
  "430": { Name: "Truffle" },
}

let parseFarmAnimalEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/farmanimals.ts")
  parseFarmAnimalEntry = mod.parseFarmAnimalEntry
})

describe("parseFarmAnimalEntry", () => {
  test("maps id, house, prices", () => {
    const a = parseFarmAnimalEntry("White Chicken", CHICKEN, LOOKUP)
    assert.equal(a.id, "White Chicken")
    assert.equal(a.house, "Coop")
    assert.equal(a.purchasePrice, 400)
    assert.equal(a.sellPrice, 800)
  })

  test("purchasePrice -1 for non-purchasable animal", () => {
    const a = parseFarmAnimalEntry("Void Chicken", VOID_CHICKEN, LOOKUP)
    assert.equal(a.purchasePrice, -1)
  })

  test("produce item resolved from lookup", () => {
    const a = parseFarmAnimalEntry("White Chicken", CHICKEN, LOOKUP)
    assert.equal(a.produce.length, 1)
    assert.equal(a.produce[0].itemId, "176")
    assert.equal(a.produce[0].name, "Egg")
  })

  test("barn animal correctly mapped", () => {
    const a = parseFarmAnimalEntry("Pig", PIG, LOOKUP)
    assert.equal(a.house, "Barn")
    assert.equal(a.produce[0].name, "Truffle")
  })

  test("null ProduceItemIds maps to empty produce array", () => {
    const a = parseFarmAnimalEntry("Void Chicken", VOID_CHICKEN, LOOKUP)
    assert.deepEqual(a.produce, [])
  })
})
