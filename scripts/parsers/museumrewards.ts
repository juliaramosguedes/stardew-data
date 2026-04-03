import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawMuseumRewardSchema, validateSample } from "../schemas/raw.ts"
import type { RawMuseumReward, ProcessedMuseumReward } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "museumrewards.json")

export function parseMuseumRewardEntry(id: string, r: RawMuseumReward): ProcessedMuseumReward {
  return {
    id,
    targetContextTags: r.TargetContextTags.map(t => ({ tag: t.Tag, count: t.Count })),
    rewardItemId: r.RewardItemId,
    rewardItemCount: r.RewardItemCount,
    rewardItemIsSpecial: r.RewardItemIsSpecial,
    rewardItemIsRecipe: r.RewardItemIsRecipe,
  }
}

export function parseMuseumRewards(): ProcessedMuseumReward[] {
  const raw = readJson<Record<string, RawMuseumReward>>(path.join(RAW_DATA, "MuseumRewards.json"))

  validateSample(raw, RawMuseumRewardSchema)

  const rewards = Object.entries(raw).map(([id, r]) =>
    parseMuseumRewardEntry(id, r)
  )

  const result = {
    _meta: meta("Data/MuseumRewards.json"),
    museumRewards: rewards,
  }

  writeJson(OUT_FILE, result)
  log("museumrewards.json", rewards.length)
  return rewards
}
