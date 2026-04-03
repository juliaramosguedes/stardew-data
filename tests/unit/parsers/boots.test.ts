import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedBoots } from "../../../scripts/types.ts"

type ParseFn = (id: string, raw: string) => ProcessedBoots

const SNEAKERS   = "Sneakers/A little flimsy... but fashionable!/50/1/0/0/Sneakers"
const DARK_BOOTS = "Dark Boots/Made from thick black leather./250/4/2/7/Dark Boots"
const GENIE      = "Genie Shoes/A curious energy permeates the fabric./250/1/6/9/Genie Shoes"

let parseBootsEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/boots.ts")
  parseBootsEntry = mod.parseBootsEntry
})

describe("parseBootsEntry", () => {
  test("maps id, name and description", () => {
    const b = parseBootsEntry("504", SNEAKERS)
    assert.equal(b.id, "504")
    assert.equal(b.name, "Sneakers")
    assert.equal(b.description, "A little flimsy... but fashionable!")
  })

  test("maps sellPrice", () => {
    const b = parseBootsEntry("511", DARK_BOOTS)
    assert.equal(b.sellPrice, 250)
  })

  test("maps defense", () => {
    const b = parseBootsEntry("511", DARK_BOOTS)
    assert.equal(b.defense, 4)
  })

  test("maps immunity", () => {
    const b = parseBootsEntry("511", DARK_BOOTS)
    assert.equal(b.immunity, 2)
  })

  test("immunity 6 for genie shoes", () => {
    const b = parseBootsEntry("513", GENIE)
    assert.equal(b.immunity, 6)
  })

  test("zero defense for sneakers", () => {
    const b = parseBootsEntry("504", SNEAKERS)
    assert.equal(b.defense, 1)
    assert.equal(b.immunity, 0)
  })
})
