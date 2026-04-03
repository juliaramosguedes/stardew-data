import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const skip = !process.env.RAW_PATH ? "RAW_PATH not set — skipping integration tests" : false

function readOutput<T>(locale: string, file: string): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", locale, file), "utf8")) as T
}

function runLocale(locale: string) {
  execFileSync(process.execPath, [
    "--env-file=.env",
    "--experimental-strip-types",
    "scripts/index.ts",
    "--only", "data",
    `--${locale}`,
  ], { stdio: "pipe" })
}

describe("locale pipeline", { skip }, () => {
  before(() => {
    runLocale("en-us")
    runLocale("pt-br")
  })

  test("data/en-US/ folder exists with output files", () => {
    const files = fs.readdirSync(path.join(process.cwd(), "data", "en-US"))
    assert.ok(files.length >= 30, `expected ≥30 files, got ${files.length}`)
    assert.ok(files.includes("objects.json"), "objects.json missing from en-US")
  })

  test("data/pt-BR/ folder exists with output files", () => {
    const files = fs.readdirSync(path.join(process.cwd(), "data", "pt-BR"))
    assert.ok(files.length >= 30, `expected ≥30 files, got ${files.length}`)
    assert.ok(files.includes("objects.json"), "objects.json missing from pt-BR")
  })

  test("pt-BR has the same file set as en-US", () => {
    const enFiles = fs.readdirSync(path.join(process.cwd(), "data", "en-US")).sort()
    const ptFiles = fs.readdirSync(path.join(process.cwd(), "data", "pt-BR")).sort()
    assert.deepEqual(ptFiles, enFiles)
  })

  test("achievements — pt-BR names differ from en-US (full file replacement)", () => {
    const en = readOutput<{ achievements: { name: string }[] }>("en-US", "achievements.json")
    const pt = readOutput<{ achievements: { name: string }[] }>("pt-BR", "achievements.json")
    assert.equal(en.achievements.length, pt.achievements.length, "achievement count should match")
    const enFirst = en.achievements.find(a => a.name === "Greenhorn (15k)")
    const ptFirst = pt.achievements.find(a => a.name === "Dedo Verde (15 mil)")
    assert.ok(enFirst, "en-US should have 'Greenhorn (15k)'")
    assert.ok(ptFirst, "pt-BR should have 'Dedo Verde (15 mil)'")
  })

  test("objects — pt-BR has translated names via Strings/ lookup", () => {
    const pt = readOutput<{ objects: { id: string; name: string }[] }>("pt-BR", "objects.json")
    const farAway = pt.objects.find(o => o.id === "FarAwayStone")
    assert.ok(farAway, "FarAwayStone not found in pt-BR objects")
    assert.equal(farAway!.name, "Pedra Longínqua")
  })

  test("objects — untranslated items keep English name", () => {
    const en = readOutput<{ objects: { id: string; name: string }[] }>("en-US", "objects.json")
    const pt = readOutput<{ objects: { id: string; name: string }[] }>("pt-BR", "objects.json")
    const enParsnip = en.objects.find(o => o.id === "24")
    const ptParsnip = pt.objects.find(o => o.id === "24")
    assert.ok(enParsnip, "Parsnip not found in en-US")
    assert.ok(ptParsnip, "Parsnip not found in pt-BR")
    assert.equal(ptParsnip!.name, enParsnip!.name, "untranslated items should keep English name")
  })

  test("_meta is present in both locales with same source", () => {
    const en = readOutput<{ _meta: { source: string; gameVersion: string } }>("en-US", "objects.json")
    const pt = readOutput<{ _meta: { source: string; gameVersion: string } }>("pt-BR", "objects.json")
    assert.ok(en._meta, "en-US objects.json missing _meta")
    assert.ok(pt._meta, "pt-BR objects.json missing _meta")
    assert.equal(en._meta.source, pt._meta.source)
    assert.equal(en._meta.gameVersion, pt._meta.gameVersion)
  })

  test("fences.json — locale-neutral file is identical in both locales", () => {
    const en = readOutput<{ fences: { id: string }[] }>("en-US", "fences.json")
    const pt = readOutput<{ fences: { id: string }[] }>("pt-BR", "fences.json")
    assert.equal(en.fences.length, pt.fences.length)
    const enIds = en.fences.map(f => f.id).sort()
    const ptIds = pt.fences.map(f => f.id).sort()
    assert.deepEqual(ptIds, enIds)
  })
})
