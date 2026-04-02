export function parseSlashFields<const T extends readonly string[]>(
  raw: string,
  fields: T,
  context?: string
): Record<T[number], string> {
  const parts = raw.split("/")
  if (parts.length < fields.length) {
    const label = context ? ` [${context}]` : ""
    console.warn(`parseSlashFields${label}: expected ${fields.length} fields, got ${parts.length}`)
  }
  return Object.fromEntries(fields.map((field, i) => [field, parts[i] ?? ""])) as Record<T[number], string>
}

export function toCamelCase(key: string): string {
  return key.charAt(0).toLowerCase() + key.slice(1)
}

export function camelKeys(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.keys(obj).map(key => [toCamelCase(key), obj[key]]))
}
