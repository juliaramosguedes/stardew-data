import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedMonsterSlayerQuest } from "../../../scripts/types.ts"
import type { RawMonsterSlayerQuest } from "../../../scripts/types.ts"

type ParseFn = (id: string, q: RawMonsterSlayerQuest, lookup: Record<string, { Name: string }>) => ProcessedMonsterSlayerQuest

const SLIMES: RawMonsterSlayerQuest = {
  Targets: ["Green Slime", "Frost Jelly", "Sludge", "Tiger Slime"],
  Count: 1000,
  RewardItemId: "(O)520",
  RewardItemPrice: 25000,
  RewardDialogue: null,
  CustomFields: null,
}

const SHADOWS: RawMonsterSlayerQuest = {
  Targets: ["Shadow Guy", "Shadow Shaman", "Shadow Brute"],
  Count: 150,
  RewardItemId: "(O)766",
  RewardItemPrice: 8000,
  RewardDialogue: null,
  CustomFields: null,
}

const LOOKUP = {
  "520": { Name: "Combat Boots" },
  "766": { Name: "Slime" },
}

let parseMonsterSlayerQuestEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/monsterslayerquests.ts")
  parseMonsterSlayerQuestEntry = mod.parseMonsterSlayerQuestEntry
})

describe("parseMonsterSlayerQuestEntry", () => {
  test("maps id and targets", () => {
    const q = parseMonsterSlayerQuestEntry("Slimes", SLIMES, LOOKUP)
    assert.equal(q.id, "Slimes")
    assert.deepEqual(q.targets, ["Green Slime", "Frost Jelly", "Sludge", "Tiger Slime"])
  })

  test("maps count and reward price", () => {
    const q = parseMonsterSlayerQuestEntry("Slimes", SLIMES, LOOKUP)
    assert.equal(q.count, 1000)
    assert.equal(q.rewardItemPrice, 25000)
  })

  test("reward item name resolved from lookup", () => {
    const q = parseMonsterSlayerQuestEntry("Slimes", SLIMES, LOOKUP)
    assert.equal(q.rewardItemId, "(O)520")
    assert.equal(q.rewardItemName, "Combat Boots")
  })

  test("shadow quest has fewer required kills", () => {
    const q = parseMonsterSlayerQuestEntry("Shadows", SHADOWS, LOOKUP)
    assert.equal(q.count, 150)
    assert.equal(q.targets.length, 3)
  })
})
