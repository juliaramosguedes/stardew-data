import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedLocation } from "../../../scripts/types.ts"
import type { ObjectLookup } from "../../../scripts/utils/game.ts"

type RawLocation = { Fish?: Record<string, { ItemId: string; Chance: number; [k: string]: unknown }> }
type ParseFn = (id: string, loc: RawLocation, lookup: ObjectLookup) => ProcessedLocation

const MOUNTAIN: RawLocation = {
  Fish: {
    "0": { ItemId: "(O)145", Chance: 0.7 },
    "1": { ItemId: "(O)136", Chance: 0.3 },
    "2": { ItemId: "SECRET_NOTE_OR_ITEM", Chance: 0.05 },
    "3": { ItemId: "RANDOM_BASE_FISH", Chance: 0.1 },
  },
}

const INLAND: RawLocation = {
  Fish: {
    "0": { ItemId: "(O)142", Chance: 0.45 },
  },
}

const LOOKUP: ObjectLookup = {
  "145": { Name: "Sunfish" },
  "136": { Name: "Largemouth Bass" },
  "142": { Name: "Catfish" },
}

let parseLocationEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/locations.ts")
  parseLocationEntry = mod.parseLocationEntry
})

describe("parseLocationEntry", () => {
  test("maps id and fish array", () => {
    const l = parseLocationEntry("Mountain", MOUNTAIN, LOOKUP)
    assert.equal(l.id, "Mountain")
  })

  test("filters out non-(O) special tokens", () => {
    const l = parseLocationEntry("Mountain", MOUNTAIN, LOOKUP)
    assert.equal(l.fish.length, 2)
    assert.ok(l.fish.every(f => f.itemId.startsWith("(O)")))
  })

  test("resolves fish names by stripping prefix", () => {
    const l = parseLocationEntry("Mountain", MOUNTAIN, LOOKUP)
    const sunfish = l.fish.find(f => f.itemId === "(O)145")
    assert.ok(sunfish)
    assert.equal(sunfish!.name, "Sunfish")
    assert.equal(sunfish!.chance, 0.7)
  })

  test("falls back to itemId when not in lookup", () => {
    const l = parseLocationEntry("Mountain", MOUNTAIN, {})
    assert.equal(l.fish[0].name, "(O)145")
  })

  test("returns empty fish array when Fish field is absent", () => {
    const l = parseLocationEntry("Desert", {}, LOOKUP)
    assert.deepEqual(l.fish, [])
  })
})
