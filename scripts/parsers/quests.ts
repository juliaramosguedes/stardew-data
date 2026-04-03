import path from "node:path"
import { RAW, LOCALE, OUT_DATA } from "../config.ts"
import { writeJson, meta, log } from "../utils.ts"
import { loadLocaleData } from "../utils/locale.ts"
import { parseSlashFields } from "../utils/parse.ts"
import { QUEST_FIELDS } from "../schemas/strings.ts"
import { QuestParsedSchema } from "../schemas/raw.ts"
import type { ProcessedQuest } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "quests.json")

export function parseQuestEntry(id: string, raw: string): ProcessedQuest {
  const fields = QuestParsedSchema.parse(parseSlashFields(raw, QUEST_FIELDS, id))
  return {
    id,
    type: fields.type,
    title: fields.title,
    description: fields.description,
    objective: fields.objective,
    target: fields.target === "-1" || fields.target === "null" ? null : fields.target,
    rewardMoney: fields.rewardMoney < 0 ? 0 : fields.rewardMoney,
    nextQuestId: fields.nextQuestId < 0 ? null : String(fields.nextQuestId),
  }
}

export function parseQuests(): ProcessedQuest[] {
  const raw = loadLocaleData<Record<string, string>>("Data/Quests.json", LOCALE, RAW)

  const quests = Object.entries(raw).map(([id, data]) =>
    parseQuestEntry(id, data)
  )

  const result = {
    _meta: meta("Data/Quests.json"),
    quests: quests.sort((a, b) => Number(a.id) - Number(b.id)),
  }

  writeJson(OUT_FILE, result)
  log("quests.json", quests.length)
  return quests
}
