import path from "node:path"
import { RAW_DATA, OUT_PROCESSED } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawFishSchema, validateSample } from "../schemas/raw.ts"
import type { RawFish, ProcessedFish } from "../types.ts"

const OUT_FILE = path.join(OUT_PROCESSED, "fish.json")

export function parseFishEntry(id: string, obj: RawFish): ProcessedFish {
  const spawnData = obj.SpawnData ?? []
  const seasons = [...new Set(
    spawnData.map(s => s.Season).filter((s): s is string => s !== null)
  )] as ProcessedFish["seasons"]
  const locations = [...new Set(
    spawnData.map(s => s.Location).filter((s): s is string => s !== null)
  )]
  const weather = [...new Set(
    spawnData.map(s => s.Weather).filter((s): s is string => s !== null)
  )]
  const timeRanges = [...new Set(
    spawnData.map(s => s.Time).filter((s): s is string => s !== null)
  )]
  return {
    id,
    name: obj.Name,
    sellPrice: obj.Price,
    edibility: obj.Edibility,
    contextTags: obj.ContextTags ?? [],
    spriteIndex: obj.SpriteIndex,
    locations,
    seasons,
    weather,
    timeRanges,
    difficulty: obj.Difficulty ?? 0,
    behavior: obj.BehaviorType ?? "mixed",
  }
}

export function parseFish(): ProcessedFish[] {
  const rawObjects = readJson<Record<string, unknown>>(
    path.join(RAW_DATA, "Objects.json")
  )

  const fishEntries = Object.entries(rawObjects).filter(
    ([, v]) => (v as Record<string, unknown>).Category === -4
  )
  validateSample(Object.fromEntries(fishEntries), RawFishSchema)

  const fish: ProcessedFish[] = []

  for (const [id, raw] of fishEntries) {
    fish.push(parseFishEntry(id, RawFishSchema.parse(raw)))
  }

  const result = {
    _meta: meta("Data/Objects.json (category -4)"),
    fish: fish.sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeJson(OUT_FILE, result)
  log("fish.json", fish.length)
  return fish
}
