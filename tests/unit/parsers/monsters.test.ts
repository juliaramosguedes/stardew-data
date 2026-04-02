import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedMonster } from "../../../scripts/types.ts"
import type { ObjectLookup } from "../../../scripts/utils/game.ts"

type ParseFn = (id: string, raw: string, lookup: ObjectLookup) => ProcessedMonster

const lookup: ObjectLookup = {
  "766": { Name: "Slime" },
  "767": { Name: "Bat Wing" },
}

const RAW_SLIME =
  "1/2/0/3/false/1/766 0.99 767 0.02/0.1/0.1/3/1/0.0/true/4/Green Slime"

let parseMonsterEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/monsters.ts")
  parseMonsterEntry = mod.parseMonsterEntry
})

describe("parseMonsterEntry", () => {
  test("parses basic stats correctly", () => {
    const m = parseMonsterEntry("Green Slime", RAW_SLIME, lookup)
    assert.equal(m.id, "Green Slime")
    assert.equal(m.name, "Green Slime")
    assert.equal(m.health, 1)
    assert.equal(m.damage, 2)
    assert.equal(m.minCoins, 0)
    assert.equal(m.maxCoins, 3)
    assert.equal(m.speed, 3)
    assert.equal(m.experienceGained, 1)
    assert.equal(m.isMineMonster, true)
  })

  test("parses drops with name lookup", () => {
    const m = parseMonsterEntry("Green Slime", RAW_SLIME, lookup)
    assert.equal(m.drops.length, 2)
    assert.deepEqual(m.drops[0], { itemId: "766", name: "Slime",    chance: 0.99 })
    assert.deepEqual(m.drops[1], { itemId: "767", name: "Bat Wing", chance: 0.02 })
  })

  test("falls back to id when displayName is empty", () => {
    const rawNoName = RAW_SLIME.replace("Green Slime", "")
    const m = parseMonsterEntry("FallbackMonster", rawNoName, {})
    assert.equal(m.name, "FallbackMonster")
  })
})
