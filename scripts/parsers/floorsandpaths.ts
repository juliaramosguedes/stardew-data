import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawFloorSchema, validateSample } from "../schemas/raw.ts"
import type { RawFloor, ProcessedFloor } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "floorsandpaths.json")

export function parseFloorEntry(id: string, f: RawFloor): ProcessedFloor {
  return {
    id,
    itemId: f.ItemId,
    texture: f.Texture,
    cornerX: f.Corner.X,
    cornerY: f.Corner.Y,
    footstepSound: f.FootstepSound,
    connectType: f.ConnectType,
    farmSpeedBuff: f.FarmSpeedBuff === -1 ? null : f.FarmSpeedBuff,
  }
}

export function parseFloorsAndPaths(): ProcessedFloor[] {
  const raw = readJson<Record<string, RawFloor>>(path.join(RAW_DATA, "FloorsAndPaths.json"))

  validateSample(raw, RawFloorSchema)

  const floors = Object.entries(raw).map(([id, f]) =>
    parseFloorEntry(id, f)
  )

  const result = {
    _meta: meta("Data/FloorsAndPaths.json"),
    floorsAndPaths: floors,
  }

  writeJson(OUT_FILE, result)
  log("floorsandpaths.json", floors.length)
  return floors
}
