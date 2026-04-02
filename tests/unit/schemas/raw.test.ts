import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { z } from "zod"
import { validateSample, detectAndCollect } from "../../../scripts/schemas/raw.ts"

describe("validateSample", () => {
  const schema = z.object({ x: z.number() })

  test("does not throw when all sampled entries are valid", () => {
    const data = { a: { x: 1 }, b: { x: 2 }, c: { x: 3 } }
    assert.doesNotThrow(() => validateSample(data, schema, 3))
  })

  test("throws when a sampled entry fails validation", () => {
    const data = { bad: { x: "not-a-number" as unknown as number } }
    assert.throws(
      () => validateSample(data, schema, 1),
      /Schema validation failed for "bad"/
    )
  })

  test("error message includes field path and issue", () => {
    const data = { item: { x: "oops" as unknown as number } }
    assert.throws(
      () => validateSample(data, schema, 1),
      /x:/
    )
  })

  test("does not throw on empty data", () => {
    assert.doesNotThrow(() => validateSample({}, schema))
  })
})

describe("detectAndCollect", () => {
  test("returns undefined when no extra keys", () => {
    const result = detectAndCollect({ a: 1, b: 2 }, new Set(["a", "b"]), "ctx")
    assert.equal(result, undefined)
  })

  test("returns object with unknown keys", () => {
    const result = detectAndCollect({ a: 1, b: 2, c: 3 }, new Set(["a", "b"]), "ctx")
    assert.deepEqual(result, { c: 3 })
  })

  test("returns all extras when knownKeys is empty", () => {
    const result = detectAndCollect({ x: 10, y: 20 }, new Set(), "ctx")
    assert.deepEqual(result, { x: 10, y: 20 })
  })

  test("returns undefined on empty input", () => {
    const result = detectAndCollect({}, new Set(["a"]), "ctx")
    assert.equal(result, undefined)
  })
})
