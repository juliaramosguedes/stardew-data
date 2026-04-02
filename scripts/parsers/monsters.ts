import path from "node:path"
import { RAW_DATA, OUT_PROCESSED } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { parseSlashFields } from "../utils/parse.ts"
import { parseDropPairs, type ObjectLookup } from "../utils/game.ts"
import { MONSTER_FIELDS } from "../schemas/strings.ts"
import { MonsterParsedSchema } from "../schemas/raw.ts"
import type { ProcessedMonster } from "../types.ts"

const OUT_FILE = path.join(OUT_PROCESSED, "monsters.json")

export function parseMonsterEntry(
  id: string,
  raw: string,
  lookup: ObjectLookup
): ProcessedMonster {
  const fields = MonsterParsedSchema.parse(parseSlashFields(raw, MONSTER_FIELDS, id))
  return {
    id,
    name: fields.displayName || id,
    health: fields.health,
    damage: fields.damageToFarmer,
    minCoins: fields.minCoins,
    maxCoins: fields.maxCoins,
    speed: fields.speed,
    experienceGained: fields.experienceGained,
    drops: parseDropPairs(fields.objectsToDrop, lookup),
    isMineMonster: fields.isMineMonster,
  }
}

export function parseMonsters(): ProcessedMonster[] {
  const raw = readJson<Record<string, string>>(path.join(RAW_DATA, "Monsters.json"))
  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const monsters = Object.entries(raw).map(([id, data]) =>
    parseMonsterEntry(id, data, lookup)
  )

  const result = {
    _meta: meta("Data/Monsters.json"),
    monsters: monsters.sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeJson(OUT_FILE, result)
  log("monsters.json", monsters.length)
  return monsters
}
