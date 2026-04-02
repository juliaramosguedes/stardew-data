import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedBundle } from "../../../scripts/types.ts"
import type { ObjectLookup } from "../../../scripts/utils/game.ts"

type ParseFn = (key: string, raw: string, lookup: ObjectLookup) => ProcessedBundle

const lookup: ObjectLookup = {
  "24":  { Name: "Parsnip" },
  "188": { Name: "Green Bean" },
  "190": { Name: "Cauliflower" },
  "192": { Name: "Potato" },
}

const BUNDLE_KEY = "Pantry/0"
const BUNDLE_RAW = "Spring Crops/O 465 20/24 1 0 188 1 0 190 1 0 192 1 0/0///Spring Crops"

let parseBundleEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/bundles.ts")
  parseBundleEntry = mod.parseBundleEntry
})

describe("parseBundleEntry", () => {
  test("extracts room and id from key", () => {
    const b = parseBundleEntry(BUNDLE_KEY, BUNDLE_RAW, lookup)
    assert.equal(b.id, "0")
    assert.equal(b.room, "Pantry")
  })

  test("parses name, reward, and color", () => {
    const b = parseBundleEntry(BUNDLE_KEY, BUNDLE_RAW, lookup)
    assert.equal(b.name, "Spring Crops")
    assert.equal(b.reward, "O 465 20")
    assert.equal(b.color, 0)
  })

  test("parses ingredients as triplets with name lookup", () => {
    const b = parseBundleEntry(BUNDLE_KEY, BUNDLE_RAW, lookup)
    assert.equal(b.ingredients.length, 4)
    assert.deepEqual(b.ingredients[0], { itemId: "24",  name: "Parsnip",     stack: 1, quality: 0 })
    assert.deepEqual(b.ingredients[1], { itemId: "188", name: "Green Bean",  stack: 1, quality: 0 })
    assert.deepEqual(b.ingredients[2], { itemId: "190", name: "Cauliflower", stack: 1, quality: 0 })
    assert.deepEqual(b.ingredients[3], { itemId: "192", name: "Potato",      stack: 1, quality: 0 })
  })

  test("picksRequired is null when empty", () => {
    const b = parseBundleEntry(BUNDLE_KEY, BUNDLE_RAW, lookup)
    assert.equal(b.picksRequired, null)
  })
})
