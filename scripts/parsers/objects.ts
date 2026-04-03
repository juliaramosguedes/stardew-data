import path from "node:path"
import { RAW, RAW_DATA, LOCALE, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawObjectSchema, validateSample } from "../schemas/raw.ts"
import { StringsResolver } from "../utils/locale.ts"
import type { RawObject, ProcessedObject } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "objects.json")

export function parseObjectEntry(id: string, obj: RawObject, resolver?: StringsResolver): ProcessedObject {
  return {
    id,
    name: resolver?.lookupName("Objects", id) ?? obj.Name,
    type: obj.Type,
    category: obj.Category,
    sellPrice: obj.Price,
    edibility: obj.Edibility,
    isDrink: obj.IsDrink,
    canBeGivenAsGift: obj.CanBeGivenAsGift,
    contextTags: obj.ContextTags ?? [],
    spriteIndex: obj.SpriteIndex,
    spriteSheet: obj.Texture,
    excludeFromShipping: obj.ExcludeFromShippingCollection,
  }
}

export function parseObjects(): ProcessedObject[] {
  const resolver = new StringsResolver(RAW, LOCALE)
  const raw = readJson<Record<string, RawObject>>(
    path.join(RAW_DATA, "Objects.json")
  )
  validateSample(raw, RawObjectSchema)

  const objects: ProcessedObject[] = Object.entries(raw).map(([id, obj]) =>
    parseObjectEntry(id, obj, resolver)
  )

  const result = {
    _meta: meta("Data/Objects.json"),
    objects,
  }

  writeJson(OUT_FILE, result)
  log("objects.json", objects.length)
  return objects
}
