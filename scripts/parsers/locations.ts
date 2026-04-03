import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { lookupItemName, type ObjectLookup } from "../utils/game.ts"
import type { ProcessedLocation } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "locations.json")

interface RawFishEntry {
  ItemId: string
  Chance: number
  [key: string]: unknown
}

interface RawLocation {
  Fish?: Record<string, RawFishEntry>
  [key: string]: unknown
}

export function parseLocationEntry(
  id: string,
  loc: RawLocation,
  lookup: ObjectLookup
): ProcessedLocation {
  const fish = Object.values(loc.Fish ?? {})
    .filter(f => typeof f === "object" && f !== null && typeof f.ItemId === "string" && f.ItemId.startsWith("(O)"))
    .map(f => ({
      itemId: f.ItemId,
      name: lookupItemName(lookup, f.ItemId),
      chance: f.Chance,
    }))

  return { id, fish }
}

export function parseLocations(): ProcessedLocation[] {
  const raw = readJson<Record<string, RawLocation>>(
    path.join(RAW_DATA, "Locations.json")
  )
  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const locations = Object.entries(raw)
    .map(([id, loc]) => parseLocationEntry(id, loc, lookup))
    .filter(loc => loc.fish.length > 0)

  const result = {
    _meta: meta("Data/Locations.json"),
    locations: locations.sort((a, b) => a.id.localeCompare(b.id)),
  }

  writeJson(OUT_FILE, result)
  log("locations.json", locations.length)
  return locations
}
