import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { RawFloor } from "../../../scripts/types.ts"

type ParseFn = (id: string, f: RawFloor) => {
  id: string
  itemId: string
  texture: string
  cornerX: number
  cornerY: number
  footstepSound: string
  connectType: string
  farmSpeedBuff: number | null
}

const WOOD_FLOOR: RawFloor = {
  Id: "0",
  ItemId: "328",
  Texture: "TerrainFeatures\\Flooring",
  Corner: { X: 0, Y: 0 },
  WinterTexture: "TerrainFeatures\\Flooring_winter",
  WinterCorner: { X: 0, Y: 0 },
  PlacementSound: "axchop",
  RemovalSound: null,
  RemovalDebrisType: 12,
  FootstepSound: "woodyStep",
  ConnectType: "Default",
  ShadowType: "Square",
  CornerSize: 4,
  FarmSpeedBuff: -1.0,
}

const GRAVEL_PATH: RawFloor = {
  Id: "7",
  ItemId: "409",
  Texture: "TerrainFeatures\\Flooring",
  Corner: { X: 192, Y: 64 },
  WinterTexture: "TerrainFeatures\\Flooring_winter",
  WinterCorner: { X: 192, Y: 64 },
  PlacementSound: "stoneStep",
  RemovalSound: "hammer",
  RemovalDebrisType: 14,
  FootstepSound: "stoneStep",
  ConnectType: "Path",
  ShadowType: "None",
  CornerSize: 4,
  FarmSpeedBuff: -1.0,
}

let parseFloorEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/floorsandpaths.ts")
  parseFloorEntry = mod.parseFloorEntry
})

describe("parseFloorEntry", () => {
  test("maps id, itemId, and texture", () => {
    const f = parseFloorEntry("0", WOOD_FLOOR)
    assert.equal(f.id, "0")
    assert.equal(f.itemId, "328")
    assert.equal(f.texture, "TerrainFeatures\\Flooring")
  })

  test("maps corner coordinates", () => {
    const f = parseFloorEntry("7", GRAVEL_PATH)
    assert.equal(f.cornerX, 192)
    assert.equal(f.cornerY, 64)
  })

  test("maps footstepSound and connectType", () => {
    const f = parseFloorEntry("0", WOOD_FLOOR)
    assert.equal(f.footstepSound, "woodyStep")
    assert.equal(f.connectType, "Default")
  })

  test("farmSpeedBuff -1 maps to null", () => {
    const f = parseFloorEntry("0", WOOD_FLOOR)
    assert.equal(f.farmSpeedBuff, null)
  })
})
