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

const LOCALE_FLAGS: Record<string, string> = {
  "--en-us": "en-US",
  "--pt-br": "pt-BR",
  "--de-de": "de-DE",
  "--es-es": "es-ES",
  "--fr-fr": "fr-FR",
  "--hu-hu": "hu-HU",
  "--it-it": "it-IT",
  "--ja-jp": "ja-JP",
  "--ko-kr": "ko-KR",
  "--ru-ru": "ru-RU",
  "--tr-tr": "tr-TR",
  "--zh-cn": "zh-CN",
}

export const SUPPORTED_LOCALES = Object.values(LOCALE_FLAGS)

const localeArg = process.argv.slice(2).find(a => a in LOCALE_FLAGS)
export const LOCALE = localeArg ? LOCALE_FLAGS[localeArg] : "en-US"

export const RAW = rawPath
export const RAW_DATA = path.join(RAW, "Data")
export const RAW_TILESHEETS = path.join(RAW, "TileSheets")
export const RAW_CHARACTERS = path.join(RAW, "Characters")
export const RAW_PORTRAITS = path.join(RAW, "Portraits")
export const RAW_MAPS = path.join(RAW, "Maps")
export const RAW_BUILDINGS = path.join(RAW, "Buildings")
export const RAW_LOOSE_SPRITES = path.join(RAW, "LooseSprites")

export const OUT_DATA = path.join(process.cwd(), "data", LOCALE)
export const OUT_SPRITES = path.join(process.cwd(), "sprites")

export const GAME_VERSION = "1.6.15"
