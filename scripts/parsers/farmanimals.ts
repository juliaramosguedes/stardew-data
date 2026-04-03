import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawFarmAnimalSchema, validateSample } from "../schemas/raw.ts"
import { lookupItemName, type ObjectLookup } from "../utils/game.ts"
import type { RawFarmAnimal, ProcessedFarmAnimal } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "farmanimals.json")

export function parseFarmAnimalEntry(
  id: string,
  a: RawFarmAnimal,
  lookup: ObjectLookup
): ProcessedFarmAnimal {
  return {
    id,
    house: a.House,
    purchasePrice: a.PurchasePrice,
    sellPrice: a.SellPrice,
    produce: (a.ProduceItemIds ?? []).map(p => ({
      itemId: p.ItemId,
      name: lookupItemName(lookup, p.ItemId),
    })),
  }
}

export function parseFarmAnimals(): ProcessedFarmAnimal[] {
  const raw = readJson<Record<string, RawFarmAnimal>>(
    path.join(RAW_DATA, "FarmAnimals.json")
  )
  validateSample(raw, RawFarmAnimalSchema)

  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const animals = Object.entries(raw).map(([id, a]) =>
    parseFarmAnimalEntry(id, a, lookup)
  )

  const result = {
    _meta: meta("Data/FarmAnimals.json"),
    farmAnimals: animals,
  }

  writeJson(OUT_FILE, result)
  log("farmanimals.json", animals.length)
  return animals
}
