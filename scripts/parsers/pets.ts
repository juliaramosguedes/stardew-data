import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawPetSchema, validateSample } from "../schemas/raw.ts"
import type { RawPet, ProcessedPet } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "pets.json")

export function parsePetEntry(id: string, p: RawPet): ProcessedPet {
  return {
    id,
    displayName: p.DisplayName,
    barkSound: p.BarkSound,
    moveSpeed: p.MoveSpeed,
  }
}

export function parsePets(): ProcessedPet[] {
  const raw = readJson<Record<string, RawPet>>(path.join(RAW_DATA, "Pets.json"))

  validateSample(raw, RawPetSchema)

  const pets = Object.entries(raw).map(([id, p]) =>
    parsePetEntry(id, p)
  )

  const result = {
    _meta: meta("Data/Pets.json"),
    pets,
  }

  writeJson(OUT_FILE, result)
  log("pets.json", pets.length)
  return pets
}
