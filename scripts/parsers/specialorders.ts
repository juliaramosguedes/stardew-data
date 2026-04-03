import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawSpecialOrderSchema, validateSample } from "../schemas/raw.ts"
import type { RawSpecialOrder, ProcessedSpecialOrder } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "specialorders.json")

function parseAcceptedTags(data: Record<string, string> | null | undefined): string[] {
  const raw = data?.AcceptedContextTags
  if (!raw) return []
  return raw.split(",").map(t => t.trim()).filter(Boolean)
}

export function parseSpecialOrderEntry(id: string, order: RawSpecialOrder): ProcessedSpecialOrder {
  return {
    id,
    requester: order.Requester,
    duration: order.Duration,
    repeatable: order.Repeatable,
    orderType: order.OrderType,
    objectives: order.Objectives.map(o => ({
      type: o.Type,
      requiredCount: o.RequiredCount,
      acceptedTags: parseAcceptedTags(o.Data),
    })),
    rewards: (order.Rewards ?? []).map(r => ({ type: r.Type })),
  }
}

export function parseSpecialOrders(): ProcessedSpecialOrder[] {
  const raw = readJson<Record<string, RawSpecialOrder>>(
    path.join(RAW_DATA, "SpecialOrders.json")
  )
  validateSample(raw, RawSpecialOrderSchema)

  const orders = Object.entries(raw).map(([id, order]) =>
    parseSpecialOrderEntry(id, order)
  )

  const result = {
    _meta: meta("Data/SpecialOrders.json"),
    specialOrders: orders,
  }

  writeJson(OUT_FILE, result)
  log("specialorders.json", orders.length)
  return orders
}
