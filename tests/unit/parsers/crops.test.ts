import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedCrop } from "../../../scripts/types.ts"
import type { RawCrop, RawObject } from "../../../scripts/types.ts"

type CalcFn = (growthDays: number, regrowDays: number | null) => number
type ParseFn = (seedId: string, crop: RawCrop, harvestItem: RawObject, seedPrice?: number) => ProcessedCrop

const HARVEST_ITEM: RawObject = {
  Name: "Parsnip",
  DisplayName: "Parsnip",
  Description: "",
  Type: "Basic",
  Category: -75,
  Price: 35,
  Texture: null,
  SpriteIndex: 24,
  Edibility: 10,
  IsDrink: false,
  Buffs: null,
  ContextTags: ["veggie_item"],
  CanBeGivenAsGift: true,
  ExcludeFromShippingCollection: false,
  CustomFields: null,
}

const PARSNIP_CROP: RawCrop = {
  Seasons: ["Spring"],
  DaysInPhase: [1, 1, 1, 1, 2],
  RegrowDays: -1,
  IsRaised: false,
  IsPaddyCrop: false,
  NeedsWatering: true,
  HarvestItemId: "24",
  HarvestMinStack: 1,
  HarvestMaxStack: 1,
  HarvestMaxIncreasePerFarmingLevel: 0,
  ExtraHarvestChance: 0,
  HarvestMethod: "Grab",
  HarvestMinQuality: 0,
  HarvestMaxQuality: null,
  TintColors: [],
  Texture: null,
  SpriteIndex: 0,
  CountForMonoculture: true,
  CountForPolyculture: true,
  CustomFields: null,
}

const REGROW_HARVEST: RawObject = { ...HARVEST_ITEM, Name: "Blueberry", Price: 50 }

const BLUEBERRY_CROP: RawCrop = {
  ...PARSNIP_CROP,
  Seasons: ["Summer"],
  DaysInPhase: [1, 3, 3, 3, 2],
  RegrowDays: 4,
  HarvestItemId: "258",
  HarvestMinStack: 1,
  HarvestMaxStack: 3,
  ExtraHarvestChance: 0.1,
}

let calcHarvests: CalcFn
let parseCropEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/crops.ts")
  calcHarvests = mod.calcHarvests
  parseCropEntry = mod.parseCropEntry
})

describe("calcHarvests", () => {
  test("one-time crop: floor(28 / (growthDays + 1))", () => {
    assert.equal(calcHarvests(6, null), 4)
  })

  test("regrow crop: 1 + floor(daysAfterFirst / regrowDays)", () => {
    assert.equal(calcHarvests(12, 4), 5)
  })

  test("returns 0 when crop cannot grow in 28 days", () => {
    assert.equal(calcHarvests(28, null), 0)
    assert.equal(calcHarvests(30, null), 0)
  })

  test("regrow with exactly fitting days", () => {
    assert.equal(calcHarvests(10, 9), 3)
  })
})

describe("parseCropEntry", () => {
  test("maps basic fields from harvest item", () => {
    const c = parseCropEntry("472", PARSNIP_CROP, HARVEST_ITEM)
    assert.equal(c.seedId, "472")
    assert.equal(c.harvestItemId, "24")
    assert.equal(c.name, "Parsnip")
    assert.equal(c.sellPrice, 35)
    assert.equal(c.edibility, 10)
  })

  test("computes growthDays as sum of DaysInPhase", () => {
    const c = parseCropEntry("472", PARSNIP_CROP, HARVEST_ITEM)
    assert.equal(c.growthDays, 6)
  })

  test("regrowDays is null when <= 0", () => {
    const c = parseCropEntry("472", PARSNIP_CROP, HARVEST_ITEM)
    assert.equal(c.regrowDays, null)
  })

  test("regrowDays is set for regrow crops", () => {
    const c = parseCropEntry("258", BLUEBERRY_CROP, REGROW_HARVEST)
    assert.equal(c.regrowDays, 4)
  })

  test("computes _calc harvests and profit", () => {
    const c = parseCropEntry("472", PARSNIP_CROP, HARVEST_ITEM, 20)
    assert.equal(c._calc.estimatedHarvests28Days, 4)
    assert.equal(c._calc.estimatedNetProfit28Days, 35 * 4 - 20)
  })

  test("seasons and harvest method are passed through", () => {
    const c = parseCropEntry("472", PARSNIP_CROP, HARVEST_ITEM)
    assert.deepEqual(c.seasons, ["Spring"])
    assert.equal(c.harvestMethod, "Grab")
    assert.equal(c.spriteSheet, "TileSheets/crops")
  })

  test("ccBundle is set for known harvest items", () => {
    const c = parseCropEntry("472", PARSNIP_CROP, HARVEST_ITEM)
    assert.equal(c.ccBundle, "Spring Crops Bundle")
  })

  test("ccBundle is null for unknown harvest items", () => {
    const c = parseCropEntry("999", { ...PARSNIP_CROP, HarvestItemId: "999" }, HARVEST_ITEM)
    assert.equal(c.ccBundle, null)
  })
})
