import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawTailoringRecipeSchema } from "../schemas/raw.ts"
import type { RawTailoringRecipe, ProcessedTailoringRecipe } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "tailoringrecipes.json")

export function parseTailoringRecipeEntry(r: RawTailoringRecipe): ProcessedTailoringRecipe {
  return {
    id: r.Id,
    firstItemTags: r.FirstItemTags ?? [],
    secondItemTags: r.SecondItemTags ?? [],
    spendRightItem: r.SpendRightItem,
    craftedItemId: r.CraftedItemId,
  }
}

export function parseTailoringRecipes(): ProcessedTailoringRecipe[] {
  const raw = readJson<RawTailoringRecipe[]>(path.join(RAW_DATA, "TailoringRecipes.json"))

  for (const entry of raw.slice(0, 5)) {
    RawTailoringRecipeSchema.parse(entry)
  }

  const recipes = raw.map(r => parseTailoringRecipeEntry(r))

  const result = {
    _meta: meta("Data/TailoringRecipes.json"),
    tailoringRecipes: recipes,
  }

  writeJson(OUT_FILE, result)
  log("tailoringrecipes.json", recipes.length)
  return recipes
}
