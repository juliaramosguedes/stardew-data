import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawMonsterSlayerQuestSchema, validateSample } from "../schemas/raw.ts"
import { lookupItemName, type ObjectLookup } from "../utils/game.ts"
import type { RawMonsterSlayerQuest, ProcessedMonsterSlayerQuest } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "monsterslayerquests.json")

export function parseMonsterSlayerQuestEntry(
  id: string,
  q: RawMonsterSlayerQuest,
  lookup: ObjectLookup
): ProcessedMonsterSlayerQuest {
  return {
    id,
    targets: q.Targets,
    count: q.Count,
    rewardItemId: q.RewardItemId,
    rewardItemName: lookupItemName(lookup, q.RewardItemId),
    rewardItemPrice: q.RewardItemPrice,
  }
}

export function parseMonsterSlayerQuests(): ProcessedMonsterSlayerQuest[] {
  const raw = readJson<Record<string, RawMonsterSlayerQuest>>(
    path.join(RAW_DATA, "MonsterSlayerQuests.json")
  )
  validateSample(raw, RawMonsterSlayerQuestSchema)

  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const quests = Object.entries(raw).map(([id, q]) =>
    parseMonsterSlayerQuestEntry(id, q, lookup)
  )

  const result = {
    _meta: meta("Data/MonsterSlayerQuests.json"),
    monsterSlayerQuests: quests,
  }

  writeJson(OUT_FILE, result)
  log("monsterslayerquests.json", quests.length)
  return quests
}
