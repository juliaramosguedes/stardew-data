import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawFruitTreeSchema, validateSample } from "../schemas/raw.ts"
import { lookupName, lookupItemName, type ObjectLookup } from "../utils/game.ts"
import type { RawFruitTree, ProcessedFruitTree } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "fruittrees.json")

export function parseFruitTreeEntry(
  id: string,
  t: RawFruitTree,
  lookup: ObjectLookup
): ProcessedFruitTree {
  return {
    id,
    name: lookupName(lookup, id),
    seasons: t.Seasons,
    daysUntilMature: t.DaysUntilMature,
    fruit: t.Fruit.map(f => ({
      itemId: f.ItemId,
      name: lookupItemName(lookup, f.ItemId),
      chance: f.Chance,
      season: f.Season ?? null,
    })),
    spriteRow: t.TextureSpriteRow,
    texture: t.Texture,
  }
}

export function parseFruitTrees(): ProcessedFruitTree[] {
  const raw = readJson<Record<string, RawFruitTree>>(
    path.join(RAW_DATA, "FruitTrees.json")
  )
  validateSample(raw, RawFruitTreeSchema)

  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const trees = Object.entries(raw).map(([id, t]) =>
    parseFruitTreeEntry(id, t, lookup)
  )

  const result = {
    _meta: meta("Data/FruitTrees.json"),
    fruitTrees: trees.sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeJson(OUT_FILE, result)
  log("fruittrees.json", trees.length)
  return trees
}
