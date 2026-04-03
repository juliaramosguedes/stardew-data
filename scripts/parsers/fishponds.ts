import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawFishPondDataSchema } from "../schemas/raw.ts"
import { lookupItemName, type ObjectLookup } from "../utils/game.ts"
import type { RawFishPondData, ProcessedFishPond } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "fishponds.json")

export function parseFishPondEntry(entry: RawFishPondData, lookup: ObjectLookup): ProcessedFishPond {
  return {
    id: entry.Id,
    requiredTags: entry.RequiredTags ?? [],
    maxPopulation: entry.MaxPopulation,
    produceChanceMin: entry.BaseMinProduceChance,
    produceChanceMax: entry.BaseMaxProduceChance,
    producedItems: (entry.ProducedItems ?? [])
      .filter(p => p.ItemId !== null)
      .map(p => ({
        itemId: p.ItemId!,
        name: lookupItemName(lookup, p.ItemId),
        requiredPopulation: p.RequiredPopulation,
        chance: p.Chance,
      })),
  }
}

export function parseFishPonds(): ProcessedFishPond[] {
  const raw = readJson<RawFishPondData[]>(path.join(RAW_DATA, "FishPondData.json"))

  for (const entry of raw.slice(0, 5)) {
    RawFishPondDataSchema.parse(entry)
  }

  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const fishPonds = raw.map(entry => parseFishPondEntry(entry, lookup))

  const result = {
    _meta: meta("Data/FishPondData.json"),
    fishPonds,
  }

  writeJson(OUT_FILE, result)
  log("fishponds.json", fishPonds.length)
  return fishPonds
}
