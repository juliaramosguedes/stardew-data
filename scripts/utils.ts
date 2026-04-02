import fs from "node:fs"
import path from "node:path"

export function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as T
}

export function writeJson(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export function exists(filePath: string): boolean {
  return fs.existsSync(filePath)
}

export function meta(sourcefile: string) {
  return {
    source: sourcefile,
    gameVersion: "1.6.15",
    generatedAt: new Date().toISOString(),
    license: "Data extracted from Stardew Valley by ConcernedApe",
  }
}

export function sumArray(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

export function log(label: string, count?: number) {
  const suffix = count !== undefined ? ` (${count})` : ""
  console.log(`  ✓ ${label}${suffix}`)
}

export function section(label: string) {
  console.log(`\n▶ ${label}`)
}
