import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedNPC } from "../../../scripts/types.ts"

type ParseFn = (name: string, char: unknown, tastesRaw?: string) => ProcessedNPC

const ABIGAIL_CHAR = {
  DisplayName: "Abigail",
  Birthday_Season: "Fall",
  Birthday_Day: 13,
  HomeRegion: "Town",
  Age: "Adult",
  Manner: "Neutral",
  SocialAnxiety: "Outgoing",
  Optimism: "Positive",
  Gender: "Female",
  IsDatable: true,
  CanBeRomanced: true,
  LoveInterest: null,
  CustomFields: null,
}

const ABIGAIL_TASTES =
  "A strange but delicious pumpkin dessert./886 281 442 522 595 689 787/Abigail likes most minerals and gems./80 60 62 64 66 68 70 72 74 76 78 420 422/Abigail is fairly picky./246 348/-75 -79 -80/16 18 772/A balanced spread./194 195 196 197 198 199"

let parseNPCEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/npcs.ts")
  parseNPCEntry = mod.parseNPCEntry
})

describe("parseNPCEntry", () => {
  test("maps name and birthday", () => {
    const npc = parseNPCEntry("Abigail", ABIGAIL_CHAR, ABIGAIL_TASTES)
    assert.equal(npc.name, "Abigail")
    assert.deepEqual(npc.birthday, { season: "Fall", day: 13 })
  })

  test("sets isMarriageCandidate from IsDatable", () => {
    const npc = parseNPCEntry("Abigail", ABIGAIL_CHAR, ABIGAIL_TASTES)
    assert.equal(npc.isMarriageCandidate, true)
  })

  test("parses lovedGifts from gift tastes", () => {
    const npc = parseNPCEntry("Abigail", ABIGAIL_CHAR, ABIGAIL_TASTES)
    assert.ok(npc.lovedGifts.includes("886"))
    assert.ok(npc.lovedGifts.includes("281"))
  })

  test("filters negative category ids from gift lists", () => {
    const npc = parseNPCEntry("Abigail", ABIGAIL_CHAR, ABIGAIL_TASTES)
    assert.ok(!npc.hatedGifts.includes("-75"))
    assert.ok(!npc.hatedGifts.includes("-79"))
  })

  test("handles missing tastesRaw with empty gift arrays", () => {
    const npc = parseNPCEntry("Abigail", ABIGAIL_CHAR)
    assert.deepEqual(npc.lovedGifts, [])
    assert.deepEqual(npc.likedGifts, [])
    assert.deepEqual(npc.dislikedGifts, [])
    assert.deepEqual(npc.hatedGifts, [])
    assert.deepEqual(npc.neutralGifts, [])
  })

  test("birthday is null when Birthday_Season is absent", () => {
    const npc = parseNPCEntry("???", { ...ABIGAIL_CHAR, Birthday_Season: null, Birthday_Day: undefined })
    assert.equal(npc.birthday, null)
  })

  test("isMarriageCandidate defaults to false when IsDatable absent", () => {
    const npc = parseNPCEntry("???", { ...ABIGAIL_CHAR, IsDatable: undefined })
    assert.equal(npc.isMarriageCandidate, false)
  })

  test("portraitSprite is null", () => {
    const npc = parseNPCEntry("Abigail", ABIGAIL_CHAR)
    assert.equal(npc.portraitSprite, null)
  })
})
