import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { parseSlashFields, camelKeys } from "../../../scripts/utils/parse.ts"

describe("parseSlashFields", () => {
  const FIELDS = ["name", "reward", "color"] as const

  test("maps values to named keys by position", () => {
    const result = parseSlashFields("Spring Onion/Money/3", FIELDS)
    assert.equal(result.name, "Spring Onion")
    assert.equal(result.reward, "Money")
    assert.equal(result.color, "3")
  })

  test("returns empty string for missing trailing fields", () => {
    const result = parseSlashFields("Spring Onion/Money", FIELDS)
    assert.equal(result.color, "")
  })

  test("handles exact field count with no warning", () => {
    assert.doesNotThrow(() => parseSlashFields("a/b/c", FIELDS))
  })
})

describe("camelKeys", () => {
  test("lowercases the first character of each key", () => {
    const result = camelKeys({ Name: "Parsnip", SellPrice: 35, IsDrink: false })
    assert.deepEqual(result, { name: "Parsnip", sellPrice: 35, isDrink: false })
  })

  test("leaves already-lowercase keys unchanged", () => {
    const result = camelKeys({ id: "123", value: 42 })
    assert.deepEqual(result, { id: "123", value: 42 })
  })
})
