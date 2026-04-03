import path from "node:path"
import { RAW, RAW_DATA, LOCALE, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawWeaponSchema, validateSample } from "../schemas/raw.ts"
import { StringsResolver } from "../utils/locale.ts"
import type { RawWeapon, ProcessedWeapon } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "weapons.json")

export function parseWeaponEntry(id: string, w: RawWeapon, resolver?: StringsResolver): ProcessedWeapon {
  return {
    id,
    name: resolver?.lookupName("Weapons", id) ?? w.Name,
    description: resolver?.lookupDescription("Weapons", id) ?? w.Description,
    type: w.Type,
    minDamage: w.MinDamage,
    maxDamage: w.MaxDamage,
    speed: w.Speed,
    critChance: w.CritChance,
    critMultiplier: w.CritMultiplier,
    knockback: w.Knockback,
    spriteIndex: w.SpriteIndex,
  }
}

export function parseWeapons(): ProcessedWeapon[] {
  const resolver = new StringsResolver(RAW, LOCALE)
  const raw = readJson<Record<string, RawWeapon>>(
    path.join(RAW_DATA, "Weapons.json")
  )
  validateSample(raw, RawWeaponSchema)

  const weapons: ProcessedWeapon[] = Object.entries(raw).map(([id, w]) =>
    parseWeaponEntry(id, w, resolver)
  )

  const result = {
    _meta: meta("Data/Weapons.json"),
    weapons: weapons.sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeJson(OUT_FILE, result)
  log("weapons.json", weapons.length)
  return weapons
}
