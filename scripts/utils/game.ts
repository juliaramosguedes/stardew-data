export type ObjectLookup = Record<string, { Name: string }>

export function lookupName(lookup: ObjectLookup, itemId: string): string {
  return lookup[itemId]?.Name ?? itemId
}

export function lookupItemName(lookup: ObjectLookup, itemId: string | null): string {
  if (!itemId) return itemId ?? ""
  const bare = itemId.replace(/^\([A-Za-z]+\)/, "")
  return lookup[bare]?.Name ?? lookup[itemId]?.Name ?? itemId
}

export function parseDropPairs(
  raw: string,
  lookup: ObjectLookup
): Array<{ itemId: string; name: string; chance: number }> {
  const tokens = raw.trim().split(" ").filter(Boolean)
  return Array.from({ length: Math.floor(tokens.length / 2) }, (_, i) => {
    const itemId = tokens[i * 2]
    return { itemId, name: lookupName(lookup, itemId), chance: parseFloat(tokens[i * 2 + 1]) }
  })
}

export function parseIngredientTriplets(
  raw: string,
  lookup: ObjectLookup
): Array<{ itemId: string; name: string; stack: number; quality: number }> {
  const tokens = raw.trim().split(" ").filter(Boolean)
  return Array.from({ length: Math.floor(tokens.length / 3) }, (_, i) => {
    const itemId = tokens[i * 3]
    return {
      itemId,
      name: lookupName(lookup, itemId),
      stack: parseInt(tokens[i * 3 + 1]),
      quality: parseInt(tokens[i * 3 + 2]),
    }
  })
}

export function parseIngredientPairs(
  raw: string,
  lookup: ObjectLookup
): Array<{ itemId: string; name: string; amount: number }> {
  const tokens = raw.trim().split(" ").filter(Boolean)
  return Array.from({ length: Math.floor(tokens.length / 2) }, (_, i) => {
    const itemId = tokens[i * 2]
    return { itemId, name: lookupName(lookup, itemId), amount: parseInt(tokens[i * 2 + 1]) }
  })
}

export function parseItemIds(raw: string): string[] {
  return raw.trim().split(" ").filter(s => s.length > 0 && !s.startsWith("-"))
}
