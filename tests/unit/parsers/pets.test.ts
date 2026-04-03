import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { RawPet } from "../../../scripts/types.ts"

type ParseFn = (id: string, p: RawPet) => {
  id: string
  displayName: string
  barkSound: string
  moveSpeed: number
}

const CAT: RawPet = {
  DisplayName: "[LocalizedText Strings\\StringsFromCSFiles:Event.cs.1242]",
  BarkSound: "cat",
  MoveSpeed: 2,
}

const TURTLE: RawPet = {
  DisplayName: "Turtle",
  BarkSound: "",
  MoveSpeed: 2,
}

let parsePetEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/pets.ts")
  parsePetEntry = mod.parsePetEntry
})

describe("parsePetEntry", () => {
  test("maps id and barkSound", () => {
    const p = parsePetEntry("Cat", CAT)
    assert.equal(p.id, "Cat")
    assert.equal(p.barkSound, "cat")
  })

  test("maps moveSpeed", () => {
    const p = parsePetEntry("Cat", CAT)
    assert.equal(p.moveSpeed, 2)
  })

  test("turtle has empty barkSound", () => {
    const p = parsePetEntry("Turtle", TURTLE)
    assert.equal(p.barkSound, "")
    assert.equal(p.displayName, "Turtle")
  })
})
