import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawWildTreeSchema, validateSample } from "../schemas/raw.ts"
import { lookupItemName, type ObjectLookup } from "../utils/game.ts"
import type { RawWildTree, ProcessedWildTree } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "wildtrees.json")

export function parseWildTreeEntry(
  id: string,
  t: RawWildTree,
  lookup: ObjectLookup
): ProcessedWildTree {
  return {
    id,
    seedItemId: t.SeedItemId,
    seedName: lookupItemName(lookup, t.SeedItemId),
    growthChance: t.GrowthChance,
    tapItems: (t.TapItems ?? [])
      .filter(item => item.ItemId !== null)
      .map(item => ({
        itemId: item.ItemId!,
        name: lookupItemName(lookup, item.ItemId),
        daysUntilReady: item.DaysUntilReady,
        chance: item.Chance,
      })),
  }
}

export function parseWildTrees(): ProcessedWildTree[] {
  const raw = readJson<Record<string, RawWildTree>>(
    path.join(RAW_DATA, "WildTrees.json")
  )
  validateSample(raw, RawWildTreeSchema)

  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const trees = Object.entries(raw).map(([id, t]) =>
    parseWildTreeEntry(id, t, lookup)
  )

  const result = {
    _meta: meta("Data/WildTrees.json"),
    wildTrees: trees,
  }

  writeJson(OUT_FILE, result)
  log("wildtrees.json", trees.length)
  return trees
}
