import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawShirtSchema, RawPantsSchema, validateSample } from "../schemas/raw.ts"
import type { RawShirt, RawPants, ProcessedShirt, ProcessedPants } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "clothing.json")

export function parseShirtEntry(id: string, s: RawShirt): ProcessedShirt {
  return {
    id,
    name: s.Name,
    sellPrice: s.Price,
    spriteIndex: s.SpriteIndex,
    spriteSheet: s.Texture,
    canBeDyed: s.CanBeDyed,
    isPrismatic: s.IsPrismatic,
    hasSleeves: s.HasSleeves,
  }
}

export function parsePantsEntry(id: string, p: RawPants): ProcessedPants {
  return {
    id,
    name: p.Name,
    sellPrice: p.Price,
    spriteIndex: p.SpriteIndex,
    spriteSheet: p.Texture,
    canBeDyed: p.CanBeDyed,
    isPrismatic: p.IsPrismatic,
    defaultColor: p.DefaultColor,
  }
}

export function parseClothing(): { shirts: ProcessedShirt[]; pants: ProcessedPants[] } {
  const rawShirts = readJson<Record<string, RawShirt>>(path.join(RAW_DATA, "Shirts.json"))
  const rawPants = readJson<Record<string, RawPants>>(path.join(RAW_DATA, "Pants.json"))

  validateSample(rawShirts, RawShirtSchema)
  validateSample(rawPants, RawPantsSchema)

  const shirts = Object.entries(rawShirts).map(([id, s]) => parseShirtEntry(id, s))
  const pants = Object.entries(rawPants).map(([id, p]) => parsePantsEntry(id, p))

  const result = {
    _meta: meta("Data/Shirts.json"),
    shirts,
    pants,
  }

  writeJson(OUT_FILE, result)
  log("clothing.json", shirts.length + pants.length)
  return { shirts, pants }
}
