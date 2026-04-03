import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedSpecialOrder } from "../../../scripts/types.ts"
import type { RawSpecialOrder } from "../../../scripts/types.ts"

type ParseFn = (id: string, order: RawSpecialOrder) => ProcessedSpecialOrder

const WILLY_ORDER: RawSpecialOrder = {
  Name: "[Willy_Name]",
  Requester: "Willy",
  Duration: "Week",
  Repeatable: false,
  RequiredTags: "",
  Condition: "",
  OrderType: "",
  SpecialRule: "",
  Text: "[Willy_Text]",
  ItemToRemoveOnEnd: null,
  MailToRemoveOnEnd: null,
  RandomizedElements: null,
  CustomFields: null,
  Objectives: [
    {
      Type: "Collect",
      Text: "[Willy_Objective_0_Text]",
      RequiredCount: 100,
      Data: { AcceptedContextTags: "item_bug_meat" },
    },
  ],
  Rewards: [
    { Type: "Money", Data: { Amount: "3000" } },
    { Type: "Mail", Data: { MailReceived: "willyBugWadCutscene" } },
  ],
}

const QI_ORDER: RawSpecialOrder = {
  Name: "[QiChallenge_Name]",
  Requester: "Qi",
  Duration: "Week",
  Repeatable: true,
  RequiredTags: "",
  Condition: "",
  OrderType: "Qi",
  SpecialRule: "",
  Text: "[QiChallenge_Text]",
  ItemToRemoveOnEnd: null,
  MailToRemoveOnEnd: null,
  RandomizedElements: null,
  CustomFields: null,
  Objectives: [
    {
      Type: "Fishing",
      Text: "[QiChallenge_Objective_Text]",
      RequiredCount: 50,
      Data: null,
    },
  ],
  Rewards: null,
}

let parseSpecialOrderEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/specialorders.ts")
  parseSpecialOrderEntry = mod.parseSpecialOrderEntry
})

describe("parseSpecialOrderEntry", () => {
  test("maps id, requester and duration", () => {
    const o = parseSpecialOrderEntry("Willy", WILLY_ORDER)
    assert.equal(o.id, "Willy")
    assert.equal(o.requester, "Willy")
    assert.equal(o.duration, "Week")
  })

  test("repeatable false for board order", () => {
    const o = parseSpecialOrderEntry("Willy", WILLY_ORDER)
    assert.equal(o.repeatable, false)
  })

  test("orderType empty string for board orders", () => {
    const o = parseSpecialOrderEntry("Willy", WILLY_ORDER)
    assert.equal(o.orderType, "")
  })

  test("orderType 'Qi' for Qi challenges", () => {
    const o = parseSpecialOrderEntry("QiChallenge", QI_ORDER)
    assert.equal(o.orderType, "Qi")
    assert.equal(o.repeatable, true)
  })

  test("objective acceptedTags parsed from comma-separated string", () => {
    const o = parseSpecialOrderEntry("Willy", WILLY_ORDER)
    assert.deepEqual(o.objectives[0].acceptedTags, ["item_bug_meat"])
    assert.equal(o.objectives[0].requiredCount, 100)
  })

  test("null objective Data produces empty acceptedTags", () => {
    const o = parseSpecialOrderEntry("QiChallenge", QI_ORDER)
    assert.deepEqual(o.objectives[0].acceptedTags, [])
  })

  test("rewards are mapped", () => {
    const o = parseSpecialOrderEntry("Willy", WILLY_ORDER)
    assert.equal(o.rewards.length, 2)
    assert.equal(o.rewards[0].type, "Money")
    assert.equal(o.rewards[1].type, "Mail")
  })

  test("null rewards maps to empty array", () => {
    const o = parseSpecialOrderEntry("QiChallenge", QI_ORDER)
    assert.deepEqual(o.rewards, [])
  })
})
