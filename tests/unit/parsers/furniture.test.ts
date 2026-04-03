import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import type { ProcessedFurniture } from "../../../scripts/types.ts"

type ParseFn = (id: string, raw: string) => ProcessedFurniture

const OAK_CHAIR    = "Oak Chair/chair/-1/-1/4/350/-1/[LocalizedText Strings\\Furniture:OakChair]"
const LONG_CACTUS  = "Long Cactus/decor/1 3/1 1/1/500/-1/[LocalizedText Strings\\Furniture:LongCactus]///true"
const CATALOGUE    = "Catalogue/decor/1 2/1 1/1/30000/-1/[LocalizedText Strings\\Furniture:Catalogue]///true"

let parseFurnitureEntry: ParseFn

before(async () => {
  process.env.RAW_PATH = "."
  const mod = await import("../../../scripts/parsers/furniture.ts")
  parseFurnitureEntry = mod.parseFurnitureEntry
})

describe("parseFurnitureEntry", () => {
  test("maps id, name and type", () => {
    const f = parseFurnitureEntry("0", OAK_CHAIR)
    assert.equal(f.id, "0")
    assert.equal(f.name, "Oak Chair")
    assert.equal(f.type, "chair")
  })

  test("maps sellPrice", () => {
    const f = parseFurnitureEntry("0", OAK_CHAIR)
    assert.equal(f.sellPrice, 350)
  })

  test("tileSize -1 maps to 1x1", () => {
    const f = parseFurnitureEntry("0", OAK_CHAIR)
    assert.equal(f.tileSizeX, 1)
    assert.equal(f.tileSizeY, 1)
  })

  test("tileSize '1 3' maps to 1x3", () => {
    const f = parseFurnitureEntry("984", LONG_CACTUS)
    assert.equal(f.tileSizeX, 1)
    assert.equal(f.tileSizeY, 3)
  })

  test("rotations are preserved", () => {
    const f = parseFurnitureEntry("0", OAK_CHAIR)
    assert.equal(f.rotations, 4)
  })

  test("optional trailing fields do not break parsing", () => {
    const f = parseFurnitureEntry("1308", CATALOGUE)
    assert.equal(f.name, "Catalogue")
    assert.equal(f.sellPrice, 30000)
  })
})
