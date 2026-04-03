import path from "node:path"
import { RAW, LOCALE, OUT_DATA } from "../config.ts"
import { writeJson, meta, log } from "../utils.ts"
import { loadLocaleData } from "../utils/locale.ts"
import { parseSlashFields } from "../utils/parse.ts"
import { HAT_FIELDS } from "../schemas/strings.ts"
import { HatParsedSchema } from "../schemas/raw.ts"
import type { ProcessedHat } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "hats.json")

export function parseHatEntry(id: string, raw: string): ProcessedHat {
  const fields = HatParsedSchema.parse(parseSlashFields(raw, HAT_FIELDS, id))
  const explicit = raw.split("/")[6]
  const spriteIndex = explicit !== undefined && explicit !== ""
    ? Number(explicit)
    : Number(id)
  return {
    id,
    name: fields.name,
    description: fields.description,
    showRealHair: fields.showRealHair,
    spriteIndex: isNaN(spriteIndex) ? 0 : spriteIndex,
  }
}

export function parseHats(): ProcessedHat[] {
  const raw = loadLocaleData<Record<string, string>>("Data/Hats.json", LOCALE, RAW)

  const hats = Object.entries(raw).map(([id, data]) =>
    parseHatEntry(id, data)
  )

  const result = {
    _meta: meta("Data/Hats.json"),
    hats,
  }

  writeJson(OUT_FILE, result)
  log("hats.json", hats.length)
  return hats
}
