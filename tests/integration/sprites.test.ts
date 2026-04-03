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

  test("characters/<npc>/ — most NPCs have ≥1 character frame", () => {
    const npcs = subdirs(path.join(SPRITES, "characters"))
    const withFrames = npcs.filter(npc => pngs(path.join(SPRITES, "characters", npc)).length >= 1)
    assert.ok(withFrames.length >= npcs.length * 0.9, `expected ≥90% of NPCs to have frames, got ${withFrames.length}/${npcs.length}`)
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

  test("bigcraftables/ — ≥50 PNG files named by craftable", () => {
    const files = pngs(path.join(SPRITES, "bigcraftables"))
    assert.ok(files.length >= 50, `expected ≥50 bigcraftable sprites, got ${files.length}`)
    assert.ok(files.every(f => /^[a-z0-9_]+\.png$/.test(f)), "all filenames should be snake_case")
  })

  test("weapons/ — ≥50 PNG files named by weapon", () => {
    const files = pngs(path.join(SPRITES, "weapons"))
    assert.ok(files.length >= 50, `expected ≥50 weapon sprites, got ${files.length}`)
    assert.ok(files.every(f => /^[a-z0-9_]+\.png$/.test(f)), "all filenames should be snake_case")
  })

  test("tools/ — ≥20 PNG files named by tool", () => {
    const files = pngs(path.join(SPRITES, "tools"))
    assert.ok(files.length >= 20, `expected ≥20 tool sprites, got ${files.length}`)
    assert.ok(files.every(f => /^[a-z0-9_]+\.png$/.test(f)), "all filenames should be snake_case")
  })

  test("hats/ — ≥100 PNG files named by hat", () => {
    const files = pngs(path.join(SPRITES, "hats"))
    assert.ok(files.length >= 100, `expected ≥100 hat sprites, got ${files.length}`)
    assert.ok(files.every(f => /^[a-z0-9_]+\.png$/.test(f)), "all filenames should be snake_case")
  })

  test("buffs/ — ≥20 PNG files named by buff id", () => {
    const files = pngs(path.join(SPRITES, "buffs"))
    assert.ok(files.length >= 20, `expected ≥20 buff icon sprites, got ${files.length}`)
  })

  test("furniture/ — ≥100 PNG files named by id_name", () => {
    const files = pngs(path.join(SPRITES, "furniture"))
    assert.ok(files.length >= 100, `expected ≥100 furniture sprites, got ${files.length}`)
    assert.ok(files.every(f => /^\d+_[a-z0-9_]+\.png$/.test(f)), "furniture filenames should be {id}_{name}.png")
  })

  test("shirts/ — ≥100 PNG files named by shirt id", () => {
    const files = pngs(path.join(SPRITES, "shirts"))
    assert.ok(files.length >= 100, `expected ≥100 shirt sprites, got ${files.length}`)
  })
})
