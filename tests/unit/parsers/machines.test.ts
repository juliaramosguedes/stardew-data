import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedMachine } from "../../../scripts/types.ts"
import type { RawMachine } from "../../../scripts/types.ts"
import type { ObjectLookup } from "../../../scripts/utils/game.ts"

type ParseFn = (id: string, m: RawMachine, bcLookup: ObjectLookup, objLookup: ObjectLookup) => ProcessedMachine

const KEG: RawMachine = {
  HasInput: true,
  HasOutput: true,
  OutputRules: [
    {
      Id: "Default",
      MinutesUntilReady: 10080,
      OutputItem: [{ ItemId: "(O)348", MinStack: 1, MaxStack: 1 }],
    },
  ],
  CustomFields: null,
}

const RECYCLER: RawMachine = {
  HasInput: true,
  HasOutput: true,
  OutputRules: null,
  CustomFields: null,
}

const BC_LOOKUP: ObjectLookup = { "12": { Name: "Keg" } }
const OBJ_LOOKUP: ObjectLookup = { "348": { Name: "Wine" } }

let parseMachineEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/machines.ts")
  parseMachineEntry = mod.parseMachineEntry
})

describe("parseMachineEntry", () => {
  test("maps id and flags", () => {
    const m = parseMachineEntry("(BC)12", KEG, BC_LOOKUP, OBJ_LOOKUP)
    assert.equal(m.id, "(BC)12")
    assert.equal(m.hasInput, true)
    assert.equal(m.hasOutput, true)
  })

  test("resolves name by stripping (BC) prefix", () => {
    const m = parseMachineEntry("(BC)12", KEG, BC_LOOKUP, OBJ_LOOKUP)
    assert.equal(m.name, "Keg")
  })

  test("maps output rules with timing", () => {
    const m = parseMachineEntry("(BC)12", KEG, BC_LOOKUP, OBJ_LOOKUP)
    assert.equal(m.outputRules.length, 1)
    assert.equal(m.outputRules[0].id, "Default")
    assert.equal(m.outputRules[0].minutesUntilReady, 10080)
  })

  test("resolves output item name by stripping (O) prefix", () => {
    const m = parseMachineEntry("(BC)12", KEG, BC_LOOKUP, OBJ_LOOKUP)
    assert.deepEqual(m.outputRules[0].outputItems[0], {
      itemId: "(O)348",
      name: "Wine",
      minStack: 1,
      maxStack: 1,
    })
  })

  test("handles null OutputRules as empty array", () => {
    const m = parseMachineEntry("(BC)20", RECYCLER, {}, {})
    assert.deepEqual(m.outputRules, [])
  })

  test("falls back to id when not in lookup", () => {
    const m = parseMachineEntry("(BC)999", KEG, {}, {})
    assert.equal(m.name, "(BC)999")
  })
})
