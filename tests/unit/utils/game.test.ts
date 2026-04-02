import { describe, test } from "node:test"
import assert from "node:assert/strict"
import {
  parseDropPairs,
  parseIngredientTriplets,
  parseIngredientPairs,
  parseItemIds,
} from "../../../scripts/utils/game.ts"

const lookup = {
  "24":  { Name: "Parsnip" },
  "256": { Name: "Tomato" },
  "281": { Name: "Fiber" },
}

describe("parseDropPairs", () => {
  test("parses id/chance pairs", () => {
    const result = parseDropPairs("24 0.5 256 0.25", lookup)
    assert.deepEqual(result, [
      { itemId: "24",  name: "Parsnip", chance: 0.5 },
      { itemId: "256", name: "Tomato",  chance: 0.25 },
    ])
  })

  test("falls back to itemId when not in lookup", () => {
    const result = parseDropPairs("999 1.0", lookup)
    assert.equal(result[0].name, "999")
  })

  test("returns empty array for empty string", () => {
    assert.deepEqual(parseDropPairs("", lookup), [])
  })
})

describe("parseIngredientTriplets", () => {
  test("parses id/stack/quality triplets", () => {
    const result = parseIngredientTriplets("24 2 0 281 5 1", lookup)
    assert.deepEqual(result, [
      { itemId: "24",  name: "Parsnip", stack: 2, quality: 0 },
      { itemId: "281", name: "Fiber",   stack: 5, quality: 1 },
    ])
  })
})

describe("parseIngredientPairs", () => {
  test("parses id/amount pairs", () => {
    const result = parseIngredientPairs("24 3 256 1", lookup)
    assert.deepEqual(result, [
      { itemId: "24",  name: "Parsnip", amount: 3 },
      { itemId: "256", name: "Tomato",  amount: 1 },
    ])
  })
})

describe("parseItemIds", () => {
  test("returns trimmed ids", () => {
    assert.deepEqual(parseItemIds("24 256 281"), ["24", "256", "281"])
  })

  test("filters out negative ids (category wildcards)", () => {
    assert.deepEqual(parseItemIds("24 -5 281"), ["24", "281"])
  })

  test("returns empty array for whitespace-only string", () => {
    assert.deepEqual(parseItemIds("  "), [])
  })
})
