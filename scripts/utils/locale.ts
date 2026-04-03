import path from "node:path"
import fs from "node:fs"

export function loadLocaleData<T>(file: string, locale: string, rawDataPath: string): T {
  const baseName = file.replace(/\.json$/, "")
  const localePath = path.join(rawDataPath, `${baseName}.${locale}.json`)
  const fallbackPath = path.join(rawDataPath, `${baseName}.json`)
  const chosen = fs.existsSync(localePath) ? localePath : fallbackPath
  return JSON.parse(fs.readFileSync(chosen, "utf-8")) as T
}

export class StringsResolver {
  private cache = new Map<string, Record<string, string>>()
  private rawPath: string
  private locale: string

  constructor(rawPath: string, locale: string) {
    this.rawPath = rawPath
    this.locale = locale
  }

  private load(category: string): Record<string, string> {
    if (this.cache.has(category)) return this.cache.get(category)!
    const localePath = path.join(this.rawPath, "Strings", `${category}.${this.locale}.json`)
    const basePath = path.join(this.rawPath, "Strings", `${category}.json`)
    const chosen = fs.existsSync(localePath) ? localePath : fs.existsSync(basePath) ? basePath : null
    const data = chosen ? (JSON.parse(fs.readFileSync(chosen, "utf-8")) as Record<string, string>) : {}
    this.cache.set(category, data)
    return data
  }

  lookupName(category: string, itemId: string): string | null {
    const bare = itemId.replace(/^\([A-Za-z]+\)/, "")
    return this.load(category)[`${bare}_Name`] ?? null
  }

  lookupDescription(category: string, itemId: string): string | null {
    const bare = itemId.replace(/^\([A-Za-z]+\)/, "")
    return this.load(category)[`${bare}_Description`] ?? null
  }

  resolveToken(token: string): string | null {
    const match = token.match(/^\[LocalizedText Strings\\([^:]+):(.+)\]$/)
    if (!match) return null
    const [, file, key] = match
    return this.load(file)[key] ?? null
  }
}
