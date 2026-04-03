import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedQuest } from "../../../scripts/types.ts"

type ParseFn = (id: string, raw: string) => ProcessedQuest

const WIZARD_QUEST   = "Location/Meet The Wizard/Go see the Wizard./Speak to M. Rasmodius./WizardHouse/-1/0/-1/false"
const CHAINED_QUEST  = "Basic/A Winter Mystery/You've been followed./Follow the footprints./Town/0/0/161/false"
const REWARD_QUEST   = "Basic/Cryptic Note/A note from Mr. Qi./Reach floor 100./null/-1/10000/-1/false"

let parseQuestEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/quests.ts")
  parseQuestEntry = mod.parseQuestEntry
})

describe("parseQuestEntry", () => {
  test("maps id, type, and title", () => {
    const q = parseQuestEntry("1", WIZARD_QUEST)
    assert.equal(q.id, "1")
    assert.equal(q.type, "Location")
    assert.equal(q.title, "Meet The Wizard")
  })

  test("maps description and objective", () => {
    const q = parseQuestEntry("1", WIZARD_QUEST)
    assert.equal(q.description, "Go see the Wizard.")
    assert.equal(q.objective, "Speak to M. Rasmodius.")
  })

  test("named target is preserved", () => {
    const q = parseQuestEntry("1", WIZARD_QUEST)
    assert.equal(q.target, "WizardHouse")
  })

  test("target 'null' string maps to null", () => {
    const q = parseQuestEntry("3", REWARD_QUEST)
    assert.equal(q.target, null)
  })

  test("rewardMoney -1 maps to 0", () => {
    const q = parseQuestEntry("1", WIZARD_QUEST)
    assert.equal(q.rewardMoney, 0)
  })

  test("positive rewardMoney is preserved", () => {
    const q = parseQuestEntry("3", REWARD_QUEST)
    assert.equal(q.rewardMoney, 10000)
  })

  test("nextQuestId -1 maps to null", () => {
    const q = parseQuestEntry("1", WIZARD_QUEST)
    assert.equal(q.nextQuestId, null)
  })

  test("positive nextQuestId maps to string", () => {
    const q = parseQuestEntry("160", CHAINED_QUEST)
    assert.equal(q.nextQuestId, "161")
  })
})
