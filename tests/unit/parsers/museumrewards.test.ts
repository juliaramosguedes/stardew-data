import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { RawMuseumReward } from "../../../scripts/types.ts"

type ParseFn = (id: string, r: RawMuseumReward) => {
  id: string
  targetContextTags: Array<{ tag: string; count: number }>
  rewardItemId: string | null
  rewardItemCount: number
  rewardItemIsSpecial: boolean
  rewardItemIsRecipe: boolean
}

const DWARF_REWARD: RawMuseumReward = {
  TargetContextTags: [
    { Tag: "id_o_96", Count: 1 },
    { Tag: "id_o_97", Count: 1 },
    { Tag: "id_o_98", Count: 1 },
    { Tag: "id_o_99", Count: 1 },
  ],
  RewardItemId: "(O)326",
  RewardItemCount: 1,
  RewardItemIsSpecial: true,
  RewardItemIsRecipe: false,
  RewardActions: null,
  FlagOnCompletion: false,
  CustomFields: null,
}

const RECIPE_REWARD: RawMuseumReward = {
  TargetContextTags: [{ Tag: "item_type_arch", Count: 15 }],
  RewardItemId: "(O)505",
  RewardItemCount: 1,
  RewardItemIsSpecial: false,
  RewardItemIsRecipe: true,
  RewardActions: null,
  FlagOnCompletion: false,
  CustomFields: null,
}

let parseMuseumRewardEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/museumrewards.ts")
  parseMuseumRewardEntry = mod.parseMuseumRewardEntry
})

describe("parseMuseumRewardEntry", () => {
  test("maps id and rewardItemId", () => {
    const r = parseMuseumRewardEntry("dwarf", DWARF_REWARD)
    assert.equal(r.id, "dwarf")
    assert.equal(r.rewardItemId, "(O)326")
  })

  test("maps targetContextTags array", () => {
    const r = parseMuseumRewardEntry("dwarf", DWARF_REWARD)
    assert.equal(r.targetContextTags.length, 4)
    assert.equal(r.targetContextTags[0].tag, "id_o_96")
    assert.equal(r.targetContextTags[0].count, 1)
  })

  test("rewardItemIsSpecial and rewardItemIsRecipe flags", () => {
    const r = parseMuseumRewardEntry("dwarf", DWARF_REWARD)
    assert.equal(r.rewardItemIsSpecial, true)
    assert.equal(r.rewardItemIsRecipe, false)
  })

  test("recipe reward maps isRecipe true", () => {
    const r = parseMuseumRewardEntry("arch15", RECIPE_REWARD)
    assert.equal(r.rewardItemIsRecipe, true)
    assert.equal(r.rewardItemIsSpecial, false)
  })

  test("rewardItemCount is mapped", () => {
    const r = parseMuseumRewardEntry("dwarf", DWARF_REWARD)
    assert.equal(r.rewardItemCount, 1)
  })
})
