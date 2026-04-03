import path from "node:path"
import { RAW, LOCALE, OUT_DATA } from "../config.ts"
import { writeJson, meta, log } from "../utils.ts"
import { loadLocaleData } from "../utils/locale.ts"
import { parseSlashFields } from "../utils/parse.ts"
import { BOOTS_FIELDS } from "../schemas/strings.ts"
import { BootsParsedSchema } from "../schemas/raw.ts"
import type { ProcessedBoots } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "boots.json")

export function parseBootsEntry(id: string, raw: string): ProcessedBoots {
  const fields = BootsParsedSchema.parse(parseSlashFields(raw, BOOTS_FIELDS, id))
  return {
    id,
    name: fields.name,
    description: fields.description,
    sellPrice: fields.price,
    defense: fields.defense,
    immunity: fields.immunity,
  }
}

export function parseBoots(): ProcessedBoots[] {
  const raw = loadLocaleData<Record<string, string>>("Data/Boots.json", LOCALE, RAW)

  const boots = Object.entries(raw).map(([id, data]) =>
    parseBootsEntry(id, data)
  )

  const result = {
    _meta: meta("Data/Boots.json"),
    boots: boots.sort((a, b) => Number(a.id) - Number(b.id)),
  }

  writeJson(OUT_FILE, result)
  log("boots.json", boots.length)
  return boots
}
