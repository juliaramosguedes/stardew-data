import path from "node:path"
import { RAW_DATA, OUT_DATA } from "../config.ts"
import { readJson, writeJson, meta, log } from "../utils.ts"
import { RawMachineSchema, validateSample } from "../schemas/raw.ts"
import { lookupItemName, type ObjectLookup } from "../utils/game.ts"
import type { RawMachine, ProcessedMachine } from "../types.ts"

const OUT_FILE = path.join(OUT_DATA, "machines.json")

function bigCraftableName(lookup: ObjectLookup, id: string): string {
  const bare = id.replace(/^\(BC\)/, "")
  return lookup[bare]?.Name ?? lookup[id]?.Name ?? id
}

export function parseMachineEntry(
  id: string,
  m: RawMachine,
  lookup: ObjectLookup,
  objectsLookup: ObjectLookup
): ProcessedMachine {
  const outputRules = (m.OutputRules ?? []).map(rule => ({
    id: rule.Id,
    minutesUntilReady: rule.MinutesUntilReady,
    outputItems: (rule.OutputItem ?? [])
      .filter(item => item.ItemId !== null)
      .map(item => ({
        itemId: item.ItemId!,
        name: lookupItemName(objectsLookup, item.ItemId),
        minStack: item.MinStack,
        maxStack: item.MaxStack,
      })),
  }))

  return {
    id,
    name: bigCraftableName(lookup, id),
    hasInput: m.HasInput,
    hasOutput: m.HasOutput,
    outputRules,
  }
}

export function parseMachines(): ProcessedMachine[] {
  const raw = readJson<Record<string, RawMachine>>(
    path.join(RAW_DATA, "Machines.json")
  )
  validateSample(raw, RawMachineSchema)

  const bigCraftables = readJson<ObjectLookup>(
    path.join(RAW_DATA, "BigCraftables.json")
  )
  const objects = readJson<ObjectLookup>(path.join(RAW_DATA, "Objects.json"))

  const machines = Object.entries(raw).map(([id, m]) =>
    parseMachineEntry(id, m, bigCraftables, objects)
  )

  const result = {
    _meta: meta("Data/Machines.json"),
    machines: machines.sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeJson(OUT_FILE, result)
  log("machines.json", machines.length)
  return machines
}
