import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawObjectSchema, validateSample } from "../schemas/raw.ts"
import type { RawObject, ProcessedBook } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "books.json")

export function parseBookEntry(id: string, obj: RawObject): ProcessedBook {
  return {
    id,
    name: obj.Name,
    sellPrice: obj.Price,
    contextTags: obj.ContextTags ?? [],
  }
}

export function parseBooks(): ProcessedBook[] {
  const raw = readJson<Record<string, RawObject>>(path.join(RAW_DATA, "Objects.json"))
  validateSample(raw, RawObjectSchema)

  const books = Object.entries(raw)
    .filter(([, obj]) => obj.ContextTags?.includes("book_item"))
    .map(([id, obj]) => parseBookEntry(id, obj))

  const result = {
    _meta: meta("Data/Objects.json"),
    books,
  }

  writeJson(OUT_FILE, result)
  log("books.json", books.length)
  return books
}
