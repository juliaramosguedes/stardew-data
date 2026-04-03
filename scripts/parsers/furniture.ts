import path from "node:path"
import { RAW, RAW_DATA, LOCALE, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { parseSlashFields } from "../utils/parse.ts"
import { FURNITURE_FIELDS } from "../schemas/strings.ts"
import { FurnitureParsedSchema } from "../schemas/raw.ts"
import { StringsResolver } from "../utils/locale.ts"
import type { ProcessedFurniture } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "furniture.json")

function parseTileSize(raw: string): { x: number; y: number } {
  if (raw === "-1") return { x: 1, y: 1 }
  const [w, h] = raw.split(" ").map(Number)
  return { x: w ?? 1, y: h ?? 1 }
}

export function parseFurnitureEntry(id: string, raw: string, resolver?: StringsResolver): ProcessedFurniture {
  const fields = FurnitureParsedSchema.parse(parseSlashFields(raw, FURNITURE_FIELDS, id))
  const { x, y } = parseTileSize(fields.tileSize)
  return {
    id,
    name: resolver?.lookupName("Furniture", id) ?? fields.name,
    type: fields.type,
    sellPrice: fields.price,
    tileSizeX: x,
    tileSizeY: y,
    rotations: fields.rotations,
  }
}

export function parseFurniture(): ProcessedFurniture[] {
  const resolver = new StringsResolver(RAW, LOCALE)
  const raw = readJson<Record<string, string>>(path.join(RAW_DATA, "Furniture.json"))

  const furniture = Object.entries(raw).map(([id, data]) =>
    parseFurnitureEntry(id, data, resolver)
  )

  const result = {
    _meta: meta("Data/Furniture.json"),
    furniture: furniture.sort((a, b) => Number(a.id) - Number(b.id)),
  }

  writeJson(OUT_FILE, result)
  log("furniture.json", furniture.length)
  return furniture
}
