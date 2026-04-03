import path from "node:path"
import { RAW, RAW_DATA, LOCALE, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawBuildingSchema, validateSample } from "../schemas/raw.ts"
import { StringsResolver } from "../utils/locale.ts"
import type { RawBuilding, ProcessedBuilding } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "buildings.json")

export function parseBuildingEntry(
  id: string,
  b: RawBuilding,
  lookup: Record<string, { Name: string }>,
  resolver?: StringsResolver
): ProcessedBuilding {
  return {
    id,
    name: resolver?.lookupName("Buildings", id) ?? b.Name,
    description: resolver?.lookupDescription("Buildings", id) ?? b.Description,
    buildCost: b.BuildCost,
    buildDays: b.BuildDays,
    buildMaterials: (b.BuildMaterials ?? []).map(m => ({
      itemId: m.ItemId,
      amount: m.Amount,
      name: lookup[m.ItemId]?.Name ?? m.ItemId,
    })),
    maxOccupants: b.MaxOccupants,
    hayCapacity: b.HayCapacity,
    builder: b.Builder,
    isMagical: b.MagicalConstruction,
    texture: b.Texture,
  }
}

export function parseBuildings(): ProcessedBuilding[] {
  const resolver = new StringsResolver(RAW, LOCALE)
  const raw = readJson<Record<string, RawBuilding>>(
    path.join(RAW_DATA, "Buildings.json")
  )
  validateSample(raw, RawBuildingSchema)

  const rawObjects = readJson<Record<string, { Name: string }>>(
    path.join(RAW_DATA, "Objects.json")
  )

  const buildings: ProcessedBuilding[] = Object.entries(raw).map(([id, b]) =>
    parseBuildingEntry(id, b, rawObjects, resolver)
  )

  const result = {
    _meta: meta("Data/Buildings.json"),
    buildings,
  }

  writeJson(OUT_FILE, result)
  log("buildings.json", buildings.length)
  return buildings
}
