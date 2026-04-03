import { describe, test, before } from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const SPRITES = path.join(process.cwd(), "sprites")
const skip = !process.env.RAW_PATH ? "RAW_PATH not set — skipping sprite tests" : false

function pngs(dir: string): string[] {
  return fs.readdirSync(dir).filter(f => f.endsWith(".png"))
}

function subdirs(dir: string): string[] {
  return fs.readdirSync(dir).filter(f =>
    fs.statSync(path.join(dir, f)).isDirectory()
  )
}

describe("sprite extraction", { skip }, () => {
  before(() => {
    execFileSync(process.execPath, [
      "--env-file=.env",
      "--experimental-strip-types",
      "scripts/index.ts",
      "--only", "sprites",
    ], { stdio: "pipe" })
  })

  test("crops/ — ≥40 individual PNG files named by crop", () => {
    const files = pngs(path.join(SPRITES, "crops"))
    assert.ok(files.length >= 40, `expected ≥40 crop sprites, got ${files.length}`)
    assert.ok(files.every(f => /^[a-z0-9_]+\.png$/.test(f)), "all crop filenames should be snake_case")
  })

  test("objects/ — ≥500 individual PNG files named by object", () => {
    const files = pngs(path.join(SPRITES, "objects"))
    assert.ok(files.length >= 500, `expected ≥500 object sprites, got ${files.length}`)
  })

  test("portraits/ — ≥20 NPC subdirectories", () => {
    const npcs = subdirs(path.join(SPRITES, "portraits"))
    assert.ok(npcs.length >= 20, `expected ≥20 NPC portrait dirs, got ${npcs.length}`)
  })

  test("portraits/<npc>/ — each NPC has ≥1 portrait frame", () => {
    const npcs = subdirs(path.join(SPRITES, "portraits"))
    for (const npc of npcs) {
      const frames = pngs(path.join(SPRITES, "portraits", npc))
      assert.ok(frames.length >= 1, `${npc} should have ≥1 portrait frame, got ${frames.length}`)
    }
  })

  test("portraits/ — most NPCs have ≥2 portrait frames", () => {
    const npcs = subdirs(path.join(SPRITES, "portraits"))
    const multiFrame = npcs.filter(npc =>
      pngs(path.join(SPRITES, "portraits", npc)).length >= 2
    )
    assert.ok(multiFrame.length >= 20, `expected ≥20 NPCs with multiple portraits, got ${multiFrame.length}`)
  })

  test("portraits/<npc>/ — frames named as sequential integers", () => {
    const npcs = subdirs(path.join(SPRITES, "portraits"))
    for (const npc of npcs.slice(0, 5)) {
      const frames = pngs(path.join(SPRITES, "portraits", npc))
      assert.ok(frames.every(f => /^\d+\.png$/.test(f)), `${npc} frames should be named 0.png, 1.png, etc.`)
    }
  })

  test("characters/ — ≥20 NPC subdirectories", () => {
    const npcs = subdirs(path.join(SPRITES, "characters"))
    assert.ok(npcs.length >= 20, `expected ≥20 NPC character dirs, got ${npcs.length}`)
  })

  test("characters/<npc>/ — each NPC has ≥1 character frame", () => {
    const npcs = subdirs(path.join(SPRITES, "characters"))
    for (const npc of npcs) {
      const frames = pngs(path.join(SPRITES, "characters", npc))
      assert.ok(frames.length >= 1, `${npc} should have ≥1 character frame, got ${frames.length}`)
    }
  })

  test("characters/ — most NPCs have ≥4 frames (4 directions)", () => {
    const npcs = subdirs(path.join(SPRITES, "characters"))
    const fullSheet = npcs.filter(npc =>
      pngs(path.join(SPRITES, "characters", npc)).length >= 4
    )
    assert.ok(fullSheet.length >= 20, `expected ≥20 NPCs with full direction sheets, got ${fullSheet.length}`)
  })

  test("characters/<npc>/ — frames named as row_col.png", () => {
    const npcs = subdirs(path.join(SPRITES, "characters"))
    for (const npc of npcs.slice(0, 5)) {
      const frames = pngs(path.join(SPRITES, "characters", npc))
      assert.ok(frames.every(f => /^\d+_\d+\.png$/.test(f)), `${npc} frames should be named row_col.png`)
    }
  })
})
