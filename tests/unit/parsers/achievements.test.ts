import { describe, test, before } from "node:test"
import assert from "node:assert/strict"

type ParseFn = (id: string, raw: string) => {
  id: string
  name: string
  description: string
  showProgressBar: boolean
  prerequisiteId: number | null
  spriteIndex: number
}

let parseAchievementEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/achievements.ts")
  parseAchievementEntry = mod.parseAchievementEntry
})

describe("parseAchievementEntry", () => {
  test("maps id, name, and description", () => {
    const a = parseAchievementEntry("0", "Greenhorn (15k)^Earn 15,000g^true^-1^18")
    assert.equal(a.id, "0")
    assert.equal(a.name, "Greenhorn (15k)")
    assert.equal(a.description, "Earn 15,000g")
  })

  test("showProgressBar true parses to boolean true", () => {
    const a = parseAchievementEntry("0", "Greenhorn (15k)^Earn 15,000g^true^-1^18")
    assert.equal(a.showProgressBar, true)
  })

  test("showProgressBar false parses to boolean false", () => {
    const a = parseAchievementEntry("4", "Legend (10mil)^Earn 10,000,000g^false^-1^3")
    assert.equal(a.showProgressBar, false)
  })

  test("prerequisiteId -1 maps to null", () => {
    const a = parseAchievementEntry("0", "Greenhorn (15k)^Earn 15,000g^true^-1^18")
    assert.equal(a.prerequisiteId, null)
  })

  test("prerequisiteId with real value is preserved", () => {
    const a = parseAchievementEntry("1", "Cowpoke (50k)^Earn 50,000g^true^0^21")
    assert.equal(a.prerequisiteId, 0)
  })

  test("spriteIndex is parsed as number", () => {
    const a = parseAchievementEntry("0", "Greenhorn (15k)^Earn 15,000g^true^-1^18")
    assert.equal(a.spriteIndex, 18)
  })
})
