import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawFenceSchema, validateSample } from "../schemas/raw.ts"
import type { RawFence, ProcessedFence } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "fences.json")

export function parseFenceEntry(id: string, f: RawFence): ProcessedFence {
  return {
    id,
    health: f.Health,
    repairHealthMin: f.RepairHealthAdjustmentMinimum,
    repairHealthMax: f.RepairHealthAdjustmentMaximum,
    texture: f.Texture,
    placementSound: f.PlacementSound,
    removalSound: f.RemovalSound,
  }
}

export function parseFences(): ProcessedFence[] {
  const raw = readJson<Record<string, RawFence>>(path.join(RAW_DATA, "Fences.json"))

  validateSample(raw, RawFenceSchema)

  const fences = Object.entries(raw).map(([id, f]) =>
    parseFenceEntry(id, f)
  )

  const result = {
    _meta: meta("Data/Fences.json"),
    fences,
  }

  writeJson(OUT_FILE, result)
  log("fences.json", fences.length)
  return fences
}
