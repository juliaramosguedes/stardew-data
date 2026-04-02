import path from "node:path"
import { RAW_DATA, OUT_PROCESSED } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawBuildingSchema, validateSample } from "../schemas/raw.ts"
import type { RawBuilding, ProcessedBuilding } from "../types.ts"

const OUT_FILE = path.join(OUT_PROCESSED, "buildings.json")

export function parseBuildingEntry(
  id: string,
  b: RawBuilding,
  lookup: Record<string, { Name: string }>
): ProcessedBuilding {
  return {
    id,
    name: b.Name,
    description: b.Description,
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
  const raw = readJson<Record<string, RawBuilding>>(
    path.join(RAW_DATA, "Buildings.json")
  )
  validateSample(raw, RawBuildingSchema)

  const rawObjects = readJson<Record<string, { Name: string }>>(
    path.join(RAW_DATA, "Objects.json")
  )

  const buildings: ProcessedBuilding[] = Object.entries(raw).map(([id, b]) =>
    parseBuildingEntry(id, b, rawObjects)
  )

  const result = {
    _meta: meta("Data/Buildings.json"),
    buildings,
  }

  writeJson(OUT_FILE, result)
  log("buildings.json", buildings.length)
  return buildings
}
