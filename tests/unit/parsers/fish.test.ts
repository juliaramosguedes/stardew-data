import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedFish } from "../../../scripts/types.ts"
import type { RawFish } from "../../../scripts/types.ts"

type ParseFn = (id: string, obj: RawFish) => ProcessedFish

const CATFISH: RawFish = {
  Name: "Catfish",
  DisplayName: "Catfish",
  Description: "A reclusive fish.",
  Type: "Fish",
  Category: -4,
  Price: 200,
  Texture: null,
  SpriteIndex: 143,
  Edibility: -300,
  IsDrink: false,
  ContextTags: ["fish_carnivorous"],
  SpawnData: [
    { Season: "Spring", Location: "Forest", Time: "600 2600", Weather: "rainy", MinFishingLevel: 4, Chance: 0.35 },
    { Season: "Fall",   Location: "Town",   Time: "600 2600", Weather: "rainy", MinFishingLevel: 4, Chance: 0.35 },
  ],
  Difficulty: 75,
  BehaviorType: "dart",
  CustomFields: null,
}

const NO_SPAWN_FISH: RawFish = {
  Name: "Legend",
  DisplayName: "Legend",
  Description: "A living legend.",
  Type: "Fish",
  Category: -4,
  Price: 5000,
  Texture: null,
  SpriteIndex: 163,
  Edibility: -300,
  IsDrink: false,
  ContextTags: null,
  SpawnData: null,
  Difficulty: 110,
  BehaviorType: "mixed",
  CustomFields: null,
}

let parseFishEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/fish.ts")
  parseFishEntry = mod.parseFishEntry
})

describe("parseFishEntry", () => {
  test("maps id and core fields", () => {
    const f = parseFishEntry("143", CATFISH)
    assert.equal(f.id, "143")
    assert.equal(f.name, "Catfish")
    assert.equal(f.sellPrice, 200)
    assert.equal(f.edibility, -300)
    assert.equal(f.spriteIndex, 143)
  })

  test("extracts unique seasons from SpawnData", () => {
    const f = parseFishEntry("143", CATFISH)
    assert.deepEqual(f.seasons.sort(), ["Fall", "Spring"])
  })

  test("extracts unique locations from SpawnData", () => {
    const f = parseFishEntry("143", CATFISH)
    assert.deepEqual(f.locations.sort(), ["Forest", "Town"])
  })

  test("extracts weather and timeRanges", () => {
    const f = parseFishEntry("143", CATFISH)
    assert.deepEqual(f.weather, ["rainy"])
    assert.deepEqual(f.timeRanges, ["600 2600"])
  })

  test("maps difficulty and behavior", () => {
    const f = parseFishEntry("143", CATFISH)
    assert.equal(f.difficulty, 75)
    assert.equal(f.behavior, "dart")
  })

  test("defaults to 0 difficulty and 'mixed' behavior when absent", () => {
    const f = parseFishEntry("163", { ...NO_SPAWN_FISH, Difficulty: undefined, BehaviorType: undefined })
    assert.equal(f.difficulty, 0)
    assert.equal(f.behavior, "mixed")
  })

  test("handles null SpawnData as empty arrays", () => {
    const f = parseFishEntry("163", NO_SPAWN_FISH)
    assert.deepEqual(f.seasons, [])
    assert.deepEqual(f.locations, [])
    assert.deepEqual(f.weather, [])
    assert.deepEqual(f.timeRanges, [])
  })

  test("defaults null contextTags to empty array", () => {
    const f = parseFishEntry("163", NO_SPAWN_FISH)
    assert.deepEqual(f.contextTags, [])
  })
})
