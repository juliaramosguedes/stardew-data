import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { lookupItemName, type ObjectLookup } from "../utils/game.ts"
import type { ProcessedShop } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "shops.json")

interface RawShopOwner {
  Id: string
  [key: string]: unknown
}

interface RawShopItem {
  ItemId: string
  Price?: number
  AvailableStock?: number
  [key: string]: unknown
}

interface RawShop {
  Owners?: RawShopOwner[]
  Items?: RawShopItem[]
  [key: string]: unknown
}

export function parseShopEntry(
  id: string,
  shop: RawShop,
  lookup: ObjectLookup
): ProcessedShop {
  const owners = (shop.Owners ?? []).map(o => o.Id)

  const items = (shop.Items ?? [])
    .filter(i => typeof i.ItemId === "string" && i.ItemId.startsWith("("))
    .map(i => ({
      itemId: i.ItemId,
      name: lookupItemName(lookup, i.ItemId),
      price: i.Price ?? -1,
      stock: i.AvailableStock ?? -1,
    }))

  return { id, owners, items }
}

export function parseShops(): ProcessedShop[] {
  const raw = readJson<Record<string, RawShop>>(path.join(RAW_DATA, "Shops.json"))
  const lookup = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const shops = Object.entries(raw).map(([id, shop]) =>
    parseShopEntry(id, shop, lookup)
  )

  const result = {
    _meta: meta("Data/Shops.json"),
    shops: shops.sort((a, b) => a.id.localeCompare(b.id)),
  }

  writeJson(OUT_FILE, result)
  log("shops.json", shops.length)
  return shops
}
