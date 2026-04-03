import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawGarbageCansFileSchema } from "../schemas/raw.ts"
import type { RawGarbageCan, ProcessedGarbageCan } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "garbagecans.json")

export function parseGarbageCanEntry(id: string, can: RawGarbageCan): ProcessedGarbageCan {
  return {
    id,
    baseChance: can.BaseChance === -1 ? null : can.BaseChance,
    items: can.Items.map(item => ({
      id: item.Id,
      itemId: item.ItemId,
      condition: item.Condition,
    })),
  }
}

export function parseGarbageCans(): ProcessedGarbageCan[] {
  const file = readJson<{ DefaultBaseChance: number; GarbageCans: Record<string, RawGarbageCan> }>(
    path.join(RAW_DATA, "GarbageCans.json")
  )

  RawGarbageCansFileSchema.parse(file)

  const cans = Object.entries(file.GarbageCans).map(([id, can]) =>
    parseGarbageCanEntry(id, can)
  )

  const result = {
    _meta: meta("Data/GarbageCans.json"),
    defaultBaseChance: file.DefaultBaseChance,
    garbageCans: cans,
  }

  writeJson(OUT_FILE, result)
  log("garbagecans.json", cans.length)
  return cans
}
