import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, sumArray, meta, log } from "../utils.ts"
import { RawCropSchema, RawObjectSchema, validateSample } from "../schemas/raw.ts"
import type { RawCrop, RawObject, ProcessedCrop, Season } from "../types.ts"

const CROPS_FILE = path.join(RAW_DATA, "Crops.json")
const OBJECTS_FILE = path.join(RAW_DATA, "Objects.json")
const OUT_FILE = path.join(OUT_DATA, "crops.json")

const CC_BUNDLE_MAP: Record<string, string> = {
  "24": "Spring Crops Bundle",
  "188": "Spring Crops Bundle",
  "190": "Spring Crops Bundle",
  "192": "Spring Crops Bundle",
  "254": "Summer Crops Bundle",
  "256": "Summer Crops Bundle",
  "260": "Summer Crops Bundle",
  "248": "Summer Crops Bundle",
  "270": "Fall Crops Bundle",
  "272": "Fall Crops Bundle",
  "280": "Fall Crops Bundle",
  "284": "Fall Crops Bundle",
  "276": "Quality Crops Bundle",
  "254_quality": "Quality Crops Bundle",
  "590": "Quality Crops Bundle",
}

export function calcHarvests(growthDays: number, regrowDays: number | null): number {
  const daysAfterFirst = 28 - growthDays
  if (daysAfterFirst <= 0) return 0
  if (regrowDays === null) return Math.floor(28 / (growthDays + 1))
  return 1 + Math.floor(daysAfterFirst / regrowDays)
}

export function parseCropEntry(
  seedId: string,
  crop: RawCrop,
  harvestItem: RawObject,
  seedPrice: number = 0
): ProcessedCrop {
  const growthDays = sumArray(crop.DaysInPhase)
  const regrowDays = crop.RegrowDays > 0 ? crop.RegrowDays : null
  const estimatedHarvests = calcHarvests(growthDays, regrowDays)
  const estimatedRevenue = harvestItem.Price * estimatedHarvests
  const netProfit = estimatedRevenue - seedPrice
  return {
    seedId,
    harvestItemId: crop.HarvestItemId,
    name: harvestItem.Name,
    seasons: crop.Seasons as Season[],
    growthDays,
    regrowDays,
    sellPrice: harvestItem.Price,
    edibility: harvestItem.Edibility,
    isRaised: crop.IsRaised,
    isPaddyCrop: crop.IsPaddyCrop,
    harvestMethod: crop.HarvestMethod,
    minHarvest: crop.HarvestMinStack,
    maxHarvest: crop.HarvestMaxStack,
    extraHarvestChance: crop.ExtraHarvestChance,
    spriteIndex: crop.SpriteIndex,
    spriteSheet: "TileSheets/crops",
    contextTags: harvestItem.ContextTags ?? [],
    ccBundle: CC_BUNDLE_MAP[crop.HarvestItemId] ?? null,
    _calc: {
      estimatedHarvests28Days: estimatedHarvests,
      estimatedNetProfit28Days: netProfit,
      profitPerDay: Math.round((netProfit / 28) * 10) / 10,
    },
  }
}

export function parseCrops(): ProcessedCrop[] {
  const rawCrops = readJson<Record<string, RawCrop>>(CROPS_FILE)
  const rawObjects = readJson<Record<string, RawObject>>(OBJECTS_FILE)
  validateSample(rawCrops, RawCropSchema)
  validateSample(rawObjects, RawObjectSchema)

  const crops: ProcessedCrop[] = []

  for (const [seedId, crop] of Object.entries(rawCrops)) {
    const harvestItem = rawObjects[crop.HarvestItemId]
    if (!harvestItem) continue
    const seedPrice = rawObjects[seedId]?.Price ?? 0
    crops.push(parseCropEntry(seedId, crop, harvestItem, seedPrice))
  }

  const result = {
    _meta: meta("Data/Crops.json + Data/Objects.json"),
    crops: crops.sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeJson(OUT_FILE, result)
  log("crops.json", crops.length)
  return crops
}
