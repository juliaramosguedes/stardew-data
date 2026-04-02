import path from "node:path"
import { RAW_DATA, OUT_PROCESSED } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawObjectSchema, validateSample } from "../schemas/raw.ts"
import type { RawObject, ProcessedObject } from "../types.ts"

const OUT_FILE = path.join(OUT_PROCESSED, "objects.json")

export function parseObjectEntry(id: string, obj: RawObject): ProcessedObject {
  return {
    id,
    name: obj.Name,
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
  const raw = readJson<Record<string, RawObject>>(
    path.join(RAW_DATA, "Objects.json")
  )
  validateSample(raw, RawObjectSchema)

  const objects: ProcessedObject[] = Object.entries(raw).map(([id, obj]) =>
    parseObjectEntry(id, obj)
  )

  const result = {
    _meta: meta("Data/Objects.json"),
    objects,
  }

  writeJson(OUT_FILE, result)
  log("objects.json", objects.length)
  return objects
}
