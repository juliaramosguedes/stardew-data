import path from "node:path"
import fs from "node:fs"

const rawPath = process.env.RAW_PATH

if (!rawPath) {
  console.error("RAW_PATH not set. Copy .env.example to .env and set the path.")
  process.exit(1)
}

if (!fs.existsSync(rawPath)) {
  console.error(`RAW_PATH does not exist: ${rawPath}`)
  process.exit(1)
}

export const RAW = rawPath
export const RAW_DATA = path.join(RAW, "Data")
export const RAW_TILESHEETS = path.join(RAW, "TileSheets")
export const RAW_CHARACTERS = path.join(RAW, "Characters")
export const RAW_PORTRAITS = path.join(RAW, "Portraits")
export const RAW_MAPS = path.join(RAW, "Maps")
export const RAW_BUILDINGS = path.join(RAW, "Buildings")
export const RAW_LOOSE_SPRITES = path.join(RAW, "LooseSprites")

export const OUT_PROCESSED = path.join(process.cwd(), "processed")
export const OUT_SPRITES = path.join(process.cwd(), "sprites")

export const GAME_VERSION = "1.6.15"
