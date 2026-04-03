import path from "node:path"
import { RAW, RAW_DATA, LOCALE, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { loadLocaleData } from "../utils/locale.ts"
import { parseSlashFields } from "../utils/parse.ts"
import { parseItemIds } from "../utils/game.ts"
import { NPC_GIFT_TASTE_FIELDS } from "../schemas/strings.ts"
import { RawCharacterSchema, NpcGiftTastesParsedSchema, validateSample } from "../schemas/raw.ts"
import type { ProcessedNPC, Season } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "npcs.json")

const SEASON_MAP: Record<string, Season> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  winter: "Winter",
}

export function parseNPCEntry(
  name: string,
  char: ReturnType<typeof RawCharacterSchema.parse>,
  tastesRaw?: string
): ProcessedNPC {
  let lovedGifts: string[] = []
  let likedGifts: string[] = []
  let dislikedGifts: string[] = []
  let hatedGifts: string[] = []
  let neutralGifts: string[] = []

  if (tastesRaw) {
    const fields = NpcGiftTastesParsedSchema.parse(
      parseSlashFields(tastesRaw, NPC_GIFT_TASTE_FIELDS, name)
    )
    lovedGifts = parseItemIds(fields.loveIds)
    likedGifts = parseItemIds(fields.likeIds)
    dislikedGifts = parseItemIds(fields.dislikeIds)
    hatedGifts = parseItemIds(fields.hateIds)
    neutralGifts = parseItemIds(fields.neutralIds)
  }

  const birthdaySeason = char.Birthday_Season
    ? SEASON_MAP[char.Birthday_Season.toLowerCase()] ?? null
    : null

  return {
    name,
    lovedGifts,
    likedGifts,
    dislikedGifts,
    hatedGifts,
    neutralGifts,
    birthday: birthdaySeason && char.Birthday_Day != null
      ? { season: birthdaySeason, day: char.Birthday_Day }
      : null,
    isMarriageCandidate: char.IsDatable ?? false,
    portraitSprite: null,
  }
}

export function parseNPCs(): ProcessedNPC[] {
  const rawCharacters = readJson<Record<string, unknown>>(
    path.join(RAW_DATA, "Characters.json")
  )
  const rawGiftTastes = loadLocaleData<Record<string, string>>("Data/NPCGiftTastes.json", LOCALE, RAW)

  validateSample(rawCharacters, RawCharacterSchema)

  const npcs: ProcessedNPC[] = []

  for (const [name, charRaw] of Object.entries(rawCharacters)) {
    const char = RawCharacterSchema.parse(charRaw)
    const tastesRaw = rawGiftTastes[name]
    npcs.push(parseNPCEntry(name, char, tastesRaw))
  }

  const result = {
    _meta: meta("Data/Characters.json + Data/NPCGiftTastes.json"),
    npcs: npcs.sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeJson(OUT_FILE, result)
  log("npcs.json", npcs.length)
  return npcs
}
