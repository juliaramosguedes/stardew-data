import path from "node:path"
import { RAW, RAW_DATA, LOCALE, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawBigCraftableSchema, validateSample } from "../schemas/raw.ts"
import { StringsResolver } from "../utils/locale.ts"
import type { RawBigCraftable, ProcessedBigCraftable } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "bigcraftables.json")

export function parseBigCraftableEntry(id: string, bc: RawBigCraftable, resolver?: StringsResolver): ProcessedBigCraftable {
  return {
    id,
    name: resolver?.lookupName("BigCraftables", id) ?? bc.Name,
    sellPrice: bc.Price,
    fragility: bc.Fragility,
    canBePlacedOutdoors: bc.CanBePlacedOutdoors,
    canBePlacedIndoors: bc.CanBePlacedIndoors,
    isLamp: bc.IsLamp,
    spriteIndex: bc.SpriteIndex,
    spriteSheet: bc.Texture,
    contextTags: bc.ContextTags ?? [],
  }
}

export function parseBigCraftables(): ProcessedBigCraftable[] {
  const resolver = new StringsResolver(RAW, LOCALE)
  const raw = readJson<Record<string, RawBigCraftable>>(
    path.join(RAW_DATA, "BigCraftables.json")
  )
  validateSample(raw, RawBigCraftableSchema)

  const bigCraftables = Object.entries(raw).map(([id, bc]) =>
    parseBigCraftableEntry(id, bc, resolver)
  )

  const result = {
    _meta: meta("Data/BigCraftables.json"),
    bigCraftables,
  }

  writeJson(OUT_FILE, result)
  log("bigcraftables.json", bigCraftables.length)
  return bigCraftables
}
