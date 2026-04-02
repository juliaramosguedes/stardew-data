import path from "node:path"
import { RAW_DATA, OUT_PROCESSED } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { parseSlashFields } from "../utils/parse.ts"
import { parseIngredientPairs, type ObjectLookup } from "../utils/game.ts"
import { COOKING_RECIPE_FIELDS, CRAFTING_RECIPE_FIELDS } from "../schemas/strings.ts"
import { RecipeParsedSchema } from "../schemas/raw.ts"
import type { ProcessedRecipe } from "../types.ts"

const OUT_FILE = path.join(OUT_PROCESSED, "recipes.json")

export function parseRecipeEntry(
  id: string,
  raw: string,
  lookup: ObjectLookup,
  type: "cooking" | "crafting"
): ProcessedRecipe {
  const fieldNames = type === "cooking" ? COOKING_RECIPE_FIELDS : CRAFTING_RECIPE_FIELDS
  const fields = RecipeParsedSchema.parse(parseSlashFields(raw, fieldNames, id))
  const outputTokens = fields.outputPair.trim().split(" ").filter(Boolean)
  const outputItemId = outputTokens[0] ?? id
  const outputStack = parseInt(outputTokens[1] ?? "1", 10)
  return {
    id,
    name: id,
    type,
    outputItemId,
    outputItemName: lookup[outputItemId]?.Name ?? outputItemId,
    outputStack,
    ingredients: parseIngredientPairs(fields.ingredientPairs, lookup),
    unlockCondition: fields.unlockCondition,
  }
}

export function parseRecipes() {
  const rawCooking = readJson<Record<string, string>>(
    path.join(RAW_DATA, "CookingRecipes.json")
  )
  const rawCrafting = readJson<Record<string, string>>(
    path.join(RAW_DATA, "CraftingRecipes.json")
  )
  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const cooking = Object.entries(rawCooking).map(([id, raw]) =>
    parseRecipeEntry(id, raw, lookup, "cooking")
  )
  const crafting = Object.entries(rawCrafting).map(([id, raw]) =>
    parseRecipeEntry(id, raw, lookup, "crafting")
  )

  const result = {
    _meta: meta("Data/CookingRecipes.json + Data/CraftingRecipes.json"),
    cooking,
    crafting,
  }

  writeJson(OUT_FILE, result)
  log("recipes.json", cooking.length + crafting.length)
  return result
}
