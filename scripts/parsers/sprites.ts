import path from "node:path"
import fs from "node:fs"
import sharp from "sharp"
import { RAW_DATA, RAW_TILESHEETS, RAW_MAPS, RAW_PORTRAITS, RAW_CHARACTERS, OUT_SPRITES } from "../config.ts"
import { readJson, log, section } from "../utils.ts"
import type { RawCrop, RawObject } from "../types.ts"

const CROP_SPRITE_WIDTH = 16
const CROP_SPRITE_HEIGHT = 32
const CROP_SHEET_COLS = 16

const OBJECT_SPRITE_SIZE = 16
const OBJECT_SHEET_COLS = 24

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

  const rawCrops = readJson<Record<string, RawCrop>>(
    path.join(RAW_DATA, "Crops.json")
  )
  const rawObjects = readJson<Record<string, RawObject>>(
    path.join(RAW_DATA, "Objects.json")
  )

  const sheetPath = path.join(RAW_TILESHEETS, "crops.png")
  const outDir = path.join(OUT_SPRITES, "crops")
  let count = 0

  for (const crop of Object.values(rawCrops)) {
    const item = rawObjects[crop.HarvestItemId]
    if (!item) continue

    const col = crop.SpriteIndex % CROP_SHEET_COLS
    const row = Math.floor(crop.SpriteIndex / CROP_SHEET_COLS)

    const x = col * CROP_SPRITE_WIDTH
    const y = row * CROP_SPRITE_HEIGHT

    const safeName = item.Name.toLowerCase().replace(/[^a-z0-9]/g, "_")
    const outputPath = path.join(outDir, `${safeName}.png`)

    await extractSprite(sheetPath, x, y, CROP_SPRITE_WIDTH, CROP_SPRITE_HEIGHT, outputPath)
    count++
  }

  log("crop sprites", count)
}

export async function extractObjectSprites(): Promise<void> {
  section("Extracting object sprites")

  const rawObjects = readJson<Record<string, RawObject>>(
    path.join(RAW_DATA, "Objects.json")
  )

  const sheetPath = path.join(RAW_MAPS, "springobjects.png")
  if (!fs.existsSync(sheetPath)) {
    console.warn("  springobjects.png not found, skipping")
    return
  }

  const outDir = path.join(OUT_SPRITES, "objects")
  let count = 0

  for (const obj of Object.values(rawObjects)) {
    if (obj.Texture !== null) continue

    const col = obj.SpriteIndex % OBJECT_SHEET_COLS
    const row = Math.floor(obj.SpriteIndex / OBJECT_SHEET_COLS)

    const x = col * OBJECT_SPRITE_SIZE
    const y = row * OBJECT_SPRITE_SIZE

    const safeName = obj.Name.toLowerCase().replace(/[^a-z0-9]/g, "_")
    const outputPath = path.join(outDir, `${safeName}.png`)

    try {
      await extractSprite(sheetPath, x, y, OBJECT_SPRITE_SIZE, OBJECT_SPRITE_SIZE, outputPath)
      count++
    } catch {
      // sprite coords out of bounds for this sheet
    }
  }

  log("object sprites", count)
}

const PORTRAIT_SIZE = 64

const CHARACTER_FRAME_WIDTH = 16
const CHARACTER_FRAME_HEIGHT = 32

export async function extractPortraitSprites(): Promise<void> {
  section("Extracting NPC portraits")

  if (!fs.existsSync(RAW_PORTRAITS)) {
    console.warn("  Portraits folder not found, skipping")
    return
  }

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
        const x = col * PORTRAIT_SIZE
        const y = row * PORTRAIT_SIZE
        const index = row * cols + col
        const outputPath = path.join(npcDir, `${index}.png`)
        try {
          await extractSprite(src, x, y, PORTRAIT_SIZE, PORTRAIT_SIZE, outputPath)
          count++
        } catch {
          // frame out of bounds
        }
      }
    }
  }

  log("NPC portrait frames", count)
}

export async function extractCharacterSprites(): Promise<void> {
  section("Extracting character sprites")

  if (!fs.existsSync(RAW_CHARACTERS)) {
    console.warn("  Characters folder not found, skipping")
    return
  }

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

    const cols = Math.floor(meta.width / CHARACTER_FRAME_WIDTH)
    const rows = Math.floor(meta.height / CHARACTER_FRAME_HEIGHT)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * CHARACTER_FRAME_WIDTH
        const y = row * CHARACTER_FRAME_HEIGHT
        const outputPath = path.join(npcDir, `${row}_${col}.png`)
        try {
          await extractSprite(src, x, y, CHARACTER_FRAME_WIDTH, CHARACTER_FRAME_HEIGHT, outputPath)
          count++
        } catch {
          // frame out of bounds
        }
      }
    }
  }

  log("character frames", count)
}
