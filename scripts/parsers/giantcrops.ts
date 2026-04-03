import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawGiantCropSchema, validateSample } from "../schemas/raw.ts"
import { lookupItemName, type ObjectLookup } from "../utils/game.ts"
import type { RawGiantCrop, ProcessedGiantCrop } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "giantcrops.json")

export function parseGiantCropEntry(id: string, g: RawGiantCrop, lookup: ObjectLookup): ProcessedGiantCrop {
  return {
    id,
    fromItemId: g.FromItemId,
    fromItemName: lookupItemName(lookup, g.FromItemId),
    harvestItems: g.HarvestItems.map(h => ({
      itemId: h.ItemId,
      name: lookupItemName(lookup, h.ItemId),
      minStack: h.MinStack,
      maxStack: h.MaxStack,
      chance: h.Chance,
    })),
    spawnChance: g.Chance,
    health: g.Health,
  }
}

export function parseGiantCrops(): ProcessedGiantCrop[] {
  const raw = readJson<Record<string, RawGiantCrop>>(path.join(RAW_DATA, "GiantCrops.json"))
  const objects = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  validateSample(raw, RawGiantCropSchema)

  const giantCrops = Object.entries(raw).map(([id, g]) =>
    parseGiantCropEntry(id, g, objects)
  )

  const result = {
    _meta: meta("Data/GiantCrops.json"),
    giantCrops,
  }

  writeJson(OUT_FILE, result)
  log("giantcrops.json", giantCrops.length)
  return giantCrops
}
