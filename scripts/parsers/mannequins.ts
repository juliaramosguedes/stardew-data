import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawMannequinSchema, validateSample } from "../schemas/raw.ts"
import type { RawMannequin, ProcessedMannequin } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "mannequins.json")

export function parseMannequinEntry(id: string, m: RawMannequin): ProcessedMannequin {
  return {
    id,
    displayName: m.DisplayName,
    description: m.Description,
    texture: m.Texture,
    sheetIndex: m.SheetIndex,
    displaysClothingAsMale: m.DisplaysClothingAsMale,
    cursed: m.Cursed,
  }
}

export function parseMannequins(): ProcessedMannequin[] {
  const raw = readJson<Record<string, RawMannequin>>(path.join(RAW_DATA, "Mannequins.json"))

  validateSample(raw, RawMannequinSchema)

  const mannequins = Object.entries(raw).map(([id, m]) =>
    parseMannequinEntry(id, m)
  )

  const result = {
    _meta: meta("Data/Mannequins.json"),
    mannequins,
  }

  writeJson(OUT_FILE, result)
  log("mannequins.json", mannequins.length)
  return mannequins
}
