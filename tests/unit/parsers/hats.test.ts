import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedHat } from "../../../scripts/types.ts"

type ParseFn = (id: string, raw: string) => ProcessedHat

const COWBOY   = "Cowboy Hat/The leather is old and cracked./false/true//Cowboy Hat"
const ABIGAIL  = "Abigail's Bow/It's just like Abby's./true/false//Abigail's Bow/94"
const TRICORN  = "Tricorn Hat/Traditional hat for naval officers./false/true//Tricorn Hat/95"

let parseHatEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/hats.ts")
  parseHatEntry = mod.parseHatEntry
})

describe("parseHatEntry", () => {
  test("maps id and name", () => {
    const h = parseHatEntry("0", COWBOY)
    assert.equal(h.id, "0")
    assert.equal(h.name, "Cowboy Hat")
  })

  test("maps description", () => {
    const h = parseHatEntry("0", COWBOY)
    assert.equal(h.description, "The leather is old and cracked.")
  })

  test("showRealHair false for cowboy hat", () => {
    const h = parseHatEntry("0", COWBOY)
    assert.equal(h.showRealHair, false)
  })

  test("showRealHair true for Abigail's Bow", () => {
    const h = parseHatEntry("AbigailsBow", ABIGAIL)
    assert.equal(h.showRealHair, true)
  })

  test("spriteIndex from id when field absent (numeric id)", () => {
    const h = parseHatEntry("0", COWBOY)
    assert.equal(h.spriteIndex, 0)
  })

  test("explicit spriteIndex used when present", () => {
    const h = parseHatEntry("TricornHat", TRICORN)
    assert.equal(h.spriteIndex, 95)
  })

  test("explicit spriteIndex used for non-numeric id", () => {
    const h = parseHatEntry("AbigailsBow", ABIGAIL)
    assert.equal(h.spriteIndex, 94)
  })
})
