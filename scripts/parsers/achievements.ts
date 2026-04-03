import path from "node:path"
import { RAW, LOCALE, OUT_DATA } from "../config.ts"
import { writeJson, meta, log } from "../utils.ts"
import { loadLocaleData } from "../utils/locale.ts"
import { AchievementParsedSchema } from "../schemas/raw.ts"
import type { ProcessedAchievement } from "../types.ts"

const FIELDS = ["name", "description", "showProgressBar", "prerequisiteId", "spriteIndex"] as const

const OUT_FILE = path.join(OUT_DATA, "achievements.json")

export function parseAchievementEntry(id: string, raw: string): ProcessedAchievement {
  const parts = raw.split("^")
  const parsed = AchievementParsedSchema.parse(
    Object.fromEntries(FIELDS.map((field, i) => [field, parts[i] ?? ""]))
  )
  return {
    id,
    name: parsed.name,
    description: parsed.description,
    showProgressBar: parsed.showProgressBar === "true",
    prerequisiteId: parsed.prerequisiteId === -1 ? null : parsed.prerequisiteId,
    spriteIndex: parsed.spriteIndex,
  }
}

export function parseAchievements(): ProcessedAchievement[] {
  const raw = loadLocaleData<Record<string, string>>("Data/Achievements.json", LOCALE, RAW)

  const achievements = Object.entries(raw).map(([id, data]) =>
    parseAchievementEntry(id, data)
  )

  const result = {
    _meta: meta("Data/Achievements.json"),
    achievements: achievements.sort((a, b) => Number(a.id) - Number(b.id)),
  }

  writeJson(OUT_FILE, result)
  log("achievements.json", achievements.length)
  return achievements
}
