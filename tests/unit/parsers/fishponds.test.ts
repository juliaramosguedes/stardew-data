import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedFishPond } from "../../../scripts/types.ts"
import type { RawFishPondData } from "../../../scripts/types.ts"

type ParseFn = (entry: RawFishPondData, lookup: Record<string, { Name: string }>) => ProcessedFishPond

const STURGEON: RawFishPondData = {
  Id: "Sturgeon",
  RequiredTags: ["item_sturgeon"],
  Precedence: 0,
  MaxPopulation: -1,
  BaseMinProduceChance: 0.3,
  BaseMaxProduceChance: 0.9,
  WaterColor: null,
  ProducedItems: [
    { ItemId: "(O)812", RequiredPopulation: 1, Chance: 0.1, Id: "Roe" },
    { ItemId: "(O)812", RequiredPopulation: 5, Chance: 0.25, Id: "Roe2" },
  ],
}

const LEGENDARY: RawFishPondData = {
  Id: "LegendaryFish",
  RequiredTags: ["fish_legendary"],
  Precedence: 0,
  MaxPopulation: 1,
  BaseMinProduceChance: 0.0,
  BaseMaxProduceChance: 0.5,
  WaterColor: null,
  ProducedItems: null,
}

const LOOKUP = {
  "812": { Name: "Roe" },
}

let parseFishPondEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/fishponds.ts")
  parseFishPondEntry = mod.parseFishPondEntry
})

describe("parseFishPondEntry", () => {
  test("maps id and requiredTags", () => {
    const p = parseFishPondEntry(STURGEON, LOOKUP)
    assert.equal(p.id, "Sturgeon")
    assert.deepEqual(p.requiredTags, ["item_sturgeon"])
  })

  test("maps maxPopulation and produce chances", () => {
    const p = parseFishPondEntry(STURGEON, LOOKUP)
    assert.equal(p.maxPopulation, -1)
    assert.equal(p.produceChanceMin, 0.3)
    assert.equal(p.produceChanceMax, 0.9)
  })

  test("producedItems resolved from lookup", () => {
    const p = parseFishPondEntry(STURGEON, LOOKUP)
    assert.equal(p.producedItems.length, 2)
    assert.equal(p.producedItems[0].name, "Roe")
    assert.equal(p.producedItems[0].requiredPopulation, 1)
  })

  test("maxPopulation 1 for legendary fish", () => {
    const p = parseFishPondEntry(LEGENDARY, LOOKUP)
    assert.equal(p.maxPopulation, 1)
  })

  test("null ProducedItems maps to empty array", () => {
    const p = parseFishPondEntry(LEGENDARY, LOOKUP)
    assert.deepEqual(p.producedItems, [])
  })

  test("null RequiredTags maps to empty array", () => {
    const entry = { ...STURGEON, RequiredTags: null }
    const p = parseFishPondEntry(entry, LOOKUP)
    assert.deepEqual(p.requiredTags, [])
  })
})
