import path from "node:path"
import fs from "node:fs"
import sharp from "sharp"
import { RAW_DATA, RAW_TILESHEETS, RAW_MAPS, RAW_PORTRAITS, RAW_CHARACTERS, OUT_SPRITES } from "../config.ts"
import { readJson, log, section } from "../utils.ts"
import type { RawCrop, RawObject, RawBigCraftable, RawWeapon, RawTool, RawBuff, RawShirt } from "../types.ts"

const RAW_FARMER = path.join(RAW_CHARACTERS, "Farmer")

const CROP_W = 16
const CROP_H = 32
const CROP_COLS = 16

const OBJECT_SIZE = 16
const OBJECT_COLS = 24

const CRAFTABLE_W = 16
const CRAFTABLE_H = 32
const CRAFTABLE_COLS = 8

const WEAPON_SIZE = 16
const WEAPON_COLS = 8

const TOOL_SIZE = 16
const TOOL_COLS = 21

const HAT_W = 20
const HAT_H = 80
const HAT_COLS = 12

const BUFF_SIZE = 16
const BUFF_COLS = 12

const FURNITURE_UNIT = 16
const FURNITURE_COLS = 32

const SHIRT_W = 8
const SHIRT_H = 32
const SHIRT_COLS = 32

const OBJECT2_SIZE = 16
const OBJECT2_COLS = 8

const PORTRAIT_SIZE = 64
const CHARACTER_W = 16
const CHARACTER_H = 32

function safeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "_")
}

async function extractSprite(
  sheetPath: string,
  x: number,
  y: number,
  width: number,
  height: number,
  outputPath: string
): Promise<void> {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  await sharp(sheetPath)
    .extract({ left: x, top: y, width, height })
    .toFile(outputPath)
}

export async function extractCropSprites(): Promise<void> {
  section("Extracting crop sprites")
  const rawCrops = readJson<Record<string, RawCrop>>(path.join(RAW_DATA, "Crops.json"))
  const rawObjects = readJson<Record<string, RawObject>>(path.join(RAW_DATA, "Objects.json"))
  const sheetPath = path.join(RAW_TILESHEETS, "crops.png")
  const outDir = path.join(OUT_SPRITES, "crops")
  let count = 0
  for (const crop of Object.values(rawCrops)) {
    const item = rawObjects[crop.HarvestItemId]
    if (!item) continue
    const col = crop.SpriteIndex % CROP_COLS
    const row = Math.floor(crop.SpriteIndex / CROP_COLS)
    await extractSprite(sheetPath, col * CROP_W, row * CROP_H, CROP_W, CROP_H,
      path.join(outDir, `${safeName(item.Name)}.png`))
    count++
  }
  log("crop sprites", count)
}

export async function extractObjectSprites(): Promise<void> {
  section("Extracting object sprites")
  const rawObjects = readJson<Record<string, RawObject>>(path.join(RAW_DATA, "Objects.json"))
  const sheetPath = path.join(RAW_MAPS, "springobjects.png")
  if (!fs.existsSync(sheetPath)) { console.warn("  springobjects.png not found, skipping"); return }
  const outDir = path.join(OUT_SPRITES, "objects")
  let count = 0
  for (const obj of Object.values(rawObjects)) {
    if (obj.Texture !== null) continue
    const col = obj.SpriteIndex % OBJECT_COLS
    const row = Math.floor(obj.SpriteIndex / OBJECT_COLS)
    try {
      await extractSprite(sheetPath, col * OBJECT_SIZE, row * OBJECT_SIZE, OBJECT_SIZE, OBJECT_SIZE,
        path.join(outDir, `${safeName(obj.Name)}.png`))
      count++
    } catch { /* sprite coords out of bounds */ }
  }
  log("object sprites", count)
}

export async function extractObjectsExtendedSprites(): Promise<void> {
  section("Extracting extended object sprites (Objects_2)")
  const rawObjects = readJson<Record<string, RawObject>>(path.join(RAW_DATA, "Objects.json"))
  const sheetPath = path.join(RAW_TILESHEETS, "Objects_2.png")
  if (!fs.existsSync(sheetPath)) { console.warn("  Objects_2.png not found, skipping"); return }
  const outDir = path.join(OUT_SPRITES, "objects")
  let count = 0
  for (const obj of Object.values(rawObjects)) {
    if (!obj.Texture?.includes("Objects_2")) continue
    const col = obj.SpriteIndex % OBJECT2_COLS
    const row = Math.floor(obj.SpriteIndex / OBJECT2_COLS)
    try {
      await extractSprite(sheetPath, col * OBJECT2_SIZE, row * OBJECT2_SIZE, OBJECT2_SIZE, OBJECT2_SIZE,
        path.join(outDir, `${safeName(obj.Name)}.png`))
      count++
    } catch { /* sprite coords out of bounds */ }
  }
  log("object sprites (Objects_2)", count)
}

export async function extractBigCraftableSprites(): Promise<void> {
  section("Extracting big craftable sprites")
  const raw = readJson<Record<string, RawBigCraftable>>(path.join(RAW_DATA, "BigCraftables.json"))
  const sheetPath = path.join(RAW_TILESHEETS, "Craftables.png")
  const outDir = path.join(OUT_SPRITES, "bigcraftables")
  let count = 0
  for (const [, bc] of Object.entries(raw)) {
    const col = bc.SpriteIndex % CRAFTABLE_COLS
    const row = Math.floor(bc.SpriteIndex / CRAFTABLE_COLS)
    try {
      await extractSprite(sheetPath, col * CRAFTABLE_W, row * CRAFTABLE_H, CRAFTABLE_W, CRAFTABLE_H,
        path.join(outDir, `${safeName(bc.Name)}.png`))
      count++
    } catch { /* sprite coords out of bounds */ }
  }
  log("bigcraftable sprites", count)
}

export async function extractWeaponSprites(): Promise<void> {
  section("Extracting weapon sprites")
  const raw = readJson<Record<string, RawWeapon>>(path.join(RAW_DATA, "Weapons.json"))
  const sheetPath = path.join(RAW_TILESHEETS, "weapons.png")
  const outDir = path.join(OUT_SPRITES, "weapons")
  let count = 0
  for (const [, w] of Object.entries(raw)) {
    const col = w.SpriteIndex % WEAPON_COLS
    const row = Math.floor(w.SpriteIndex / WEAPON_COLS)
    try {
      await extractSprite(sheetPath, col * WEAPON_SIZE, row * WEAPON_SIZE, WEAPON_SIZE, WEAPON_SIZE,
        path.join(outDir, `${safeName(w.Name)}.png`))
      count++
    } catch { /* sprite coords out of bounds */ }
  }
  log("weapon sprites", count)
}

export async function extractToolSprites(): Promise<void> {
  section("Extracting tool sprites")
  const raw = readJson<Record<string, RawTool>>(path.join(RAW_DATA, "Tools.json"))
  const sheetPath = path.join(RAW_TILESHEETS, "tools.png")
  const outDir = path.join(OUT_SPRITES, "tools")
  let count = 0
  for (const [, t] of Object.entries(raw)) {
    const col = t.SpriteIndex % TOOL_COLS
    const row = Math.floor(t.SpriteIndex / TOOL_COLS)
    try {
      await extractSprite(sheetPath, col * TOOL_SIZE, row * TOOL_SIZE, TOOL_SIZE, TOOL_SIZE,
        path.join(outDir, `${safeName(t.Name)}.png`))
      count++
    } catch { /* sprite coords out of bounds */ }
  }
  log("tool sprites", count)
}

export async function extractHatSprites(): Promise<void> {
  section("Extracting hat sprites")
  const raw = readJson<Record<string, string>>(path.join(RAW_DATA, "Hats.json"))
  const sheetPath = path.join(RAW_FARMER, "hats.png")
  if (!fs.existsSync(sheetPath)) { console.warn("  hats.png not found, skipping"); return }
  const outDir = path.join(OUT_SPRITES, "hats")
  let count = 0
  for (const [id, data] of Object.entries(raw)) {
    const name = data.split("/")[0] ?? id
    const parts = data.split("/")
    const explicit = parts[6]
    const spriteIndex = explicit !== undefined && explicit !== "" ? Number(explicit) : Number(id)
    if (isNaN(spriteIndex)) continue
    const col = spriteIndex % HAT_COLS
    const row = Math.floor(spriteIndex / HAT_COLS)
    try {
      await extractSprite(sheetPath, col * HAT_W, row * HAT_H, HAT_W, HAT_H,
        path.join(outDir, `${safeName(name)}.png`))
      count++
    } catch { /* sprite coords out of bounds */ }
  }
  log("hat sprites", count)
}

export async function extractBuffIconSprites(): Promise<void> {
  section("Extracting buff icon sprites")
  const raw = readJson<Record<string, RawBuff>>(path.join(RAW_DATA, "Buffs.json"))
  const outDir = path.join(OUT_SPRITES, "buffs")
  let count = 0
  for (const [id, b] of Object.entries(raw)) {
    const texturePath = path.join(RAW_TILESHEETS, path.basename(b.IconTexture.replace(/\\/g, "/")) + ".png")
    if (!fs.existsSync(texturePath)) continue
    const col = b.IconSpriteIndex % BUFF_COLS
    const row = Math.floor(b.IconSpriteIndex / BUFF_COLS)
    try {
      await extractSprite(texturePath, col * BUFF_SIZE, row * BUFF_SIZE, BUFF_SIZE, BUFF_SIZE,
        path.join(outDir, `${id}.png`))
      count++
    } catch { /* sprite coords out of bounds */ }
  }
  log("buff icon sprites", count)
}

export async function extractFurnitureSprites(): Promise<void> {
  section("Extracting furniture sprites")
  const raw = readJson<Record<string, string>>(path.join(RAW_DATA, "Furniture.json"))
  const outDir = path.join(OUT_SPRITES, "furniture")
  let count = 0
  for (const [id, data] of Object.entries(raw)) {
    const parts = data.split("/")
    const name = parts[0] ?? id
    const tileSizeRaw = parts[2] ?? "1 1"
    const tileW = Number(tileSizeRaw.split(" ")[0] ?? "1") * FURNITURE_UNIT
    const tileH = Number(tileSizeRaw.split(" ")[1] ?? "1") * FURNITURE_UNIT
    const numericId = Number(id)
    if (isNaN(numericId)) continue
    const col = numericId % FURNITURE_COLS
    const row = Math.floor(numericId / FURNITURE_COLS)
    const sheetPath = path.join(RAW_TILESHEETS, "furniture.png")
    try {
      await extractSprite(sheetPath, col * FURNITURE_UNIT, row * FURNITURE_UNIT, tileW, tileH,
        path.join(outDir, `${numericId}_${safeName(name)}.png`))
      count++
    } catch { /* sprite coords out of bounds or non-numeric id */ }
  }
  log("furniture sprites", count)
}

export async function extractShirtSprites(): Promise<void> {
  section("Extracting shirt sprites")
  const raw = readJson<Record<string, RawShirt>>(path.join(RAW_DATA, "Shirts.json"))
  const sheetPath = path.join(RAW_FARMER, "shirts.png")
  if (!fs.existsSync(sheetPath)) { console.warn("  shirts.png not found, skipping"); return }
  const outDir = path.join(OUT_SPRITES, "shirts")
  let count = 0
  for (const [id, s] of Object.entries(raw)) {
    const col = s.SpriteIndex % SHIRT_COLS
    const row = Math.floor(s.SpriteIndex / SHIRT_COLS)
    try {
      await extractSprite(sheetPath, col * SHIRT_W, row * SHIRT_H, SHIRT_W, SHIRT_H,
        path.join(outDir, `${id}.png`))
      count++
    } catch { /* sprite coords out of bounds */ }
  }
  log("shirt sprites", count)
}

export async function extractPortraitSprites(): Promise<void> {
  section("Extracting NPC portraits")
  if (!fs.existsSync(RAW_PORTRAITS)) { console.warn("  Portraits folder not found, skipping"); return }
  const outDir = path.join(OUT_SPRITES, "portraits")
  const files = fs.readdirSync(RAW_PORTRAITS).filter(f => f.endsWith(".png"))
  let count = 0
  for (const file of files) {
    const src = path.join(RAW_PORTRAITS, file)
    const npcName = path.basename(file, ".png").toLowerCase()
    const npcDir = path.join(outDir, npcName)
    fs.mkdirSync(npcDir, { recursive: true })
    const meta = await sharp(src).metadata()
    if (!meta.width || !meta.height) continue
    const cols = Math.floor(meta.width / PORTRAIT_SIZE)
    const rows = Math.floor(meta.height / PORTRAIT_SIZE)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        try {
          await extractSprite(src, col * PORTRAIT_SIZE, row * PORTRAIT_SIZE, PORTRAIT_SIZE, PORTRAIT_SIZE,
            path.join(npcDir, `${index}.png`))
          count++
        } catch { /* frame out of bounds */ }
      }
    }
  }
  log("NPC portrait frames", count)
}

export async function extractCharacterSprites(): Promise<void> {
  section("Extracting character sprites")
  if (!fs.existsSync(RAW_CHARACTERS)) { console.warn("  Characters folder not found, skipping"); return }
  const outDir = path.join(OUT_SPRITES, "characters")
  const files = fs.readdirSync(RAW_CHARACTERS).filter(f => f.endsWith(".png"))
  let count = 0
  for (const file of files) {
    const src = path.join(RAW_CHARACTERS, file)
    const npcName = path.basename(file, ".png").toLowerCase()
    const npcDir = path.join(outDir, npcName)
    fs.mkdirSync(npcDir, { recursive: true })
    const meta = await sharp(src).metadata()
    if (!meta.width || !meta.height) continue
    const cols = Math.floor(meta.width / CHARACTER_W)
    const rows = Math.floor(meta.height / CHARACTER_H)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        try {
          await extractSprite(src, col * CHARACTER_W, row * CHARACTER_H, CHARACTER_W, CHARACTER_H,
            path.join(npcDir, `${row}_${col}.png`))
          count++
        } catch { /* frame out of bounds */ }
      }
    }
  }
  log("character frames", count)
}
