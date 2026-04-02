import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedWeapon } from "../../../scripts/types.ts"
import type { RawWeapon } from "../../../scripts/types.ts"

type ParseFn = (id: string, w: RawWeapon) => ProcessedWeapon

const CLUB: RawWeapon = {
  Name: "Wood Club",
  DisplayName: "Wood Club",
  Description: "A sturdy wooden club.",
  MinDamage: 3,
  MaxDamage: 5,
  Knockback: 1,
  Speed: 0,
  Precision: 0,
  Defense: 0,
  Type: 2,
  AreaOfEffect: 0,
  CritChance: 0.02,
  CritMultiplier: 3,
  Texture: null,
  SpriteIndex: 8,
  CustomFields: null,
}

let parseWeaponEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/weapons.ts")
  parseWeaponEntry = mod.parseWeaponEntry
})

describe("parseWeaponEntry", () => {
  test("maps id and name", () => {
    const w = parseWeaponEntry("14", CLUB)
    assert.equal(w.id, "14")
    assert.equal(w.name, "Wood Club")
    assert.equal(w.description, "A sturdy wooden club.")
  })

  test("maps damage and type", () => {
    const w = parseWeaponEntry("14", CLUB)
    assert.equal(w.type, 2)
    assert.equal(w.minDamage, 3)
    assert.equal(w.maxDamage, 5)
  })

  test("maps crit and combat stats", () => {
    const w = parseWeaponEntry("14", CLUB)
    assert.equal(w.speed, 0)
    assert.equal(w.critChance, 0.02)
    assert.equal(w.critMultiplier, 3)
    assert.equal(w.knockback, 1)
    assert.equal(w.spriteIndex, 8)
  })
})
