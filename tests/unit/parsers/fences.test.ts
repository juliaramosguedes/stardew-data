import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { RawFence } from "../../../scripts/types.ts"

type ParseFn = (id: string, f: RawFence) => {
  id: string
  health: number
  repairHealthMin: number
  repairHealthMax: number
  texture: string
  placementSound: string
  removalSound: string
}

const WOOD_FENCE: RawFence = {
  Health: 28,
  RepairHealthAdjustmentMinimum: -5.0,
  RepairHealthAdjustmentMaximum: 5.0,
  Texture: "LooseSprites\\Fence1",
  PlacementSound: "axe",
  RemovalSound: "axchop",
  RemovalToolIds: [],
  RemovalToolTypes: ["StardewValley.Tools.Axe"],
  RemovalDebrisType: 12,
  HeldObjectDrawOffset: "0, -20",
  LeftEndHeldObjectDrawX: -1.0,
  RightEndHeldObjectDrawX: 0.0,
}

const HARDWOOD_FENCE: RawFence = {
  Health: 280,
  RepairHealthAdjustmentMinimum: -20.0,
  RepairHealthAdjustmentMaximum: 20.0,
  Texture: "LooseSprites\\Fence5",
  PlacementSound: "axe",
  RemovalSound: "axchop",
  RemovalToolIds: [],
  RemovalToolTypes: ["StardewValley.Tools.Axe"],
  RemovalDebrisType: 12,
  HeldObjectDrawOffset: "0, -20",
  LeftEndHeldObjectDrawX: -1.0,
  RightEndHeldObjectDrawX: 0.0,
}

let parseFenceEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/fences.ts")
  parseFenceEntry = mod.parseFenceEntry
})

describe("parseFenceEntry", () => {
  test("maps id, health, and texture", () => {
    const f = parseFenceEntry("322", WOOD_FENCE)
    assert.equal(f.id, "322")
    assert.equal(f.health, 28)
    assert.equal(f.texture, "LooseSprites\\Fence1")
  })

  test("maps repair health range", () => {
    const f = parseFenceEntry("322", WOOD_FENCE)
    assert.equal(f.repairHealthMin, -5.0)
    assert.equal(f.repairHealthMax, 5.0)
  })

  test("hardwood fence has higher health", () => {
    const f = parseFenceEntry("298", HARDWOOD_FENCE)
    assert.equal(f.health, 280)
    assert.equal(f.repairHealthMin, -20.0)
  })

  test("maps placement and removal sounds", () => {
    const f = parseFenceEntry("322", WOOD_FENCE)
    assert.equal(f.placementSound, "axe")
    assert.equal(f.removalSound, "axchop")
  })
})
