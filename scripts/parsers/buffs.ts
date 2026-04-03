import path from "node:path"
import { RAW, RAW_DATA, LOCALE, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawBuffSchema, validateSample } from "../schemas/raw.ts"
import { StringsResolver } from "../utils/locale.ts"
import type { RawBuff, ProcessedBuff } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "buffs.json")

export function parseBuffEntry(id: string, b: RawBuff, resolver?: StringsResolver): ProcessedBuff {
  const resolveField = (v: string | null) =>
    v && resolver ? (resolver.resolveToken(v) ?? v) : v

  return {
    id,
    displayName: resolveField(b.DisplayName) ?? "",
    description: resolveField(b.Description),
    isDebuff: b.IsDebuff,
    duration: b.Duration,
    iconTexture: b.IconTexture,
    iconSpriteIndex: b.IconSpriteIndex,
    effects: b.Effects,
  }
}

export function parseBuffs(): ProcessedBuff[] {
  const resolver = new StringsResolver(RAW, LOCALE)
  const raw = readJson<Record<string, RawBuff>>(path.join(RAW_DATA, "Buffs.json"))

  validateSample(raw, RawBuffSchema)

  const buffs = Object.entries(raw).map(([id, b]) =>
    parseBuffEntry(id, b, resolver)
  )

  const result = {
    _meta: meta("Data/Buffs.json"),
    buffs,
  }

  writeJson(OUT_FILE, result)
  log("buffs.json", buffs.length)
  return buffs
}
