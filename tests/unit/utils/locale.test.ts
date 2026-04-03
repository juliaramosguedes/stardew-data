import { describe, test, before, after } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { loadLocaleData, StringsResolver } from "../../../scripts/utils/locale.ts"

let tmpDir: string

before(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stardew-locale-test-"))

  const dataDir = path.join(tmpDir, "Data")
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, "Items.json"), JSON.stringify({ "1": "Base Item" }))
  fs.writeFileSync(path.join(dataDir, "Items.pt-BR.json"), JSON.stringify({ "1": "Item Traduzido" }))

  const stringsDir = path.join(tmpDir, "Strings")
  fs.mkdirSync(stringsDir, { recursive: true })
  fs.writeFileSync(path.join(stringsDir, "Objects.pt-BR.json"), JSON.stringify({
    "24_Name": "Nabo",
    "24_Description": "Um legume de raiz.",
  }))
  fs.writeFileSync(path.join(stringsDir, "StringsFromCSFiles.json"), JSON.stringify({
    "Buff.cs.456": "Speedy",
  }))
  fs.writeFileSync(path.join(stringsDir, "StringsFromCSFiles.pt-BR.json"), JSON.stringify({
    "Buff.cs.456": "Veloz",
  }))
})

after(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("loadLocaleData", () => {
  test("returns locale file when it exists", () => {
    const data = loadLocaleData<Record<string, string>>("Data/Items.json", "pt-BR", tmpDir)
    assert.equal(data["1"], "Item Traduzido")
  })

  test("falls back to base file when locale file does not exist", () => {
    const data = loadLocaleData<Record<string, string>>("Data/Items.json", "de-DE", tmpDir)
    assert.equal(data["1"], "Base Item")
  })
})

describe("StringsResolver.lookupName", () => {
  test("returns translated name", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.lookupName("Objects", "24"), "Nabo")
  })

  test("returns null when item not in locale file", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.lookupName("Objects", "999"), null)
  })

  test("returns null when category file does not exist", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.lookupName("Weapons", "24"), null)
  })

  test("strips qualified item id prefix", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.lookupName("Objects", "(O)24"), "Nabo")
  })
})

describe("StringsResolver.lookupDescription", () => {
  test("returns translated description", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.lookupDescription("Objects", "24"), "Um legume de raiz.")
  })

  test("returns null when description key is missing", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.lookupDescription("Objects", "999"), null)
  })
})

describe("StringsResolver.resolveToken", () => {
  test("resolves [LocalizedText] token from locale file", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.resolveToken("[LocalizedText Strings\\StringsFromCSFiles:Buff.cs.456]"), "Veloz")
  })

  test("falls back to base Strings file when no locale file", () => {
    const resolver = new StringsResolver(tmpDir, "en-US")
    assert.equal(resolver.resolveToken("[LocalizedText Strings\\StringsFromCSFiles:Buff.cs.456]"), "Speedy")
  })

  test("returns null for plain string", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.resolveToken("plain string"), null)
  })

  test("returns null for missing key in token", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.resolveToken("[LocalizedText Strings\\StringsFromCSFiles:Missing.key]"), null)
  })
})

describe("StringsResolver caching", () => {
  test("repeated lookups return same result", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    const first = resolver.lookupName("Objects", "24")
    const second = resolver.lookupName("Objects", "24")
    assert.equal(first, second)
  })

  test("different categories are cached independently", () => {
    const resolver = new StringsResolver(tmpDir, "pt-BR")
    assert.equal(resolver.lookupName("Objects", "24"), "Nabo")
    assert.equal(resolver.lookupName("Weapons", "24"), null)
  })
})
