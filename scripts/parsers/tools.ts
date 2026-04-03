import path from "node:path"
import { RAW, RAW_DATA, LOCALE, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawToolSchema, validateSample } from "../schemas/raw.ts"
import { StringsResolver } from "../utils/locale.ts"
import type { RawTool, ProcessedTool } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "tools.json")

export function parseToolEntry(id: string, t: RawTool, resolver?: StringsResolver): ProcessedTool {
  return {
    id,
    name: resolver?.lookupName("Tools", id) ?? t.Name,
    upgradeLevel: t.UpgradeLevel,
    salePrice: t.SalePrice,
    spriteIndex: t.SpriteIndex,
    texture: t.Texture,
    upgradeFrom: t.ConventionalUpgradeFrom?.replace(/^\([A-Za-z]+\)/, "") ?? null,
  }
}

export function parseTools(): ProcessedTool[] {
  const resolver = new StringsResolver(RAW, LOCALE)
  const raw = readJson<Record<string, RawTool>>(path.join(RAW_DATA, "Tools.json"))
  validateSample(raw, RawToolSchema)

  const tools = Object.entries(raw).map(([id, t]) => parseToolEntry(id, t, resolver))

  const result = {
    _meta: meta("Data/Tools.json"),
    tools: tools.sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeJson(OUT_FILE, result)
  log("tools.json", tools.length)
  return tools
}
