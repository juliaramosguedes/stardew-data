import path from "node:path"
import { RAW, RAW_DATA, LOCALE, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { loadLocaleData } from "../utils/locale.ts"
import { parseSlashFields } from "../utils/parse.ts"
import { parseIngredientTriplets, type ObjectLookup } from "../utils/game.ts"
import { BUNDLE_FIELDS } from "../schemas/strings.ts"
import { BundleParsedSchema } from "../schemas/raw.ts"
import type { ProcessedBundle } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "bundles.json")

export function parseBundleEntry(
  key: string,
  raw: string,
  lookup: ObjectLookup
): ProcessedBundle {
  const slashIdx = key.lastIndexOf("/")
  const room = key.slice(0, slashIdx)
  const id = key.slice(slashIdx + 1)

  const fields = BundleParsedSchema.parse(parseSlashFields(raw, BUNDLE_FIELDS, key))
  return {
    id,
    name: fields.name,
    room,
    reward: fields.reward,
    color: fields.color,
    picksRequired: fields.picksRequired,
    ingredients: parseIngredientTriplets(fields.ingredients, lookup),
  }
}

export function parseBundles(): ProcessedBundle[] {
  const raw = loadLocaleData<Record<string, string>>("Data/Bundles.json", LOCALE, RAW)
  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const bundles = Object.entries(raw).map(([key, data]) =>
    parseBundleEntry(key, data, lookup)
  )

  const result = {
    _meta: meta("Data/Bundles.json"),
    bundles: bundles.sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeJson(OUT_FILE, result)
  log("bundles.json", bundles.length)
  return bundles
}
