import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawTrinketSchema, validateSample } from "../schemas/raw.ts"
import type { RawTrinket, ProcessedTrinket } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "trinkets.json")

export function parseTrinketEntry(id: string, t: RawTrinket): ProcessedTrinket {
  return {
    id,
    texture: t.Texture,
    sheetIndex: t.SheetIndex,
    effectClass: t.TrinketEffectClass,
    dropsNaturally: t.DropsNaturally,
    canBeReforged: t.CanBeReforged,
  }
}

export function parseTrinkets(): ProcessedTrinket[] {
  const raw = readJson<Record<string, RawTrinket>>(path.join(RAW_DATA, "Trinkets.json"))
  validateSample(raw, RawTrinketSchema)

  const trinkets = Object.entries(raw).map(([id, t]) =>
    parseTrinketEntry(id, t)
  )

  const result = {
    _meta: meta("Data/Trinkets.json"),
    trinkets,
  }

  writeJson(OUT_FILE, result)
  log("trinkets.json", trinkets.length)
  return trinkets
}
