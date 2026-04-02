export type Season = "Spring" | "Summer" | "Fall" | "Winter"
export type HarvestMethod = "Grab" | "Scythe"

export type {
  RawObject,
  RawCrop,
  RawBuilding,
  RawWeapon,
  RawFish,
  RawCharacter,
  RawMonster,
  RawBundle,
  RawRecipe,
} from "./schemas/raw.ts"

export interface RawMachine {
  OutputRules: Array<{
    Id: string
    Triggers: unknown[]
    OutputItem: Array<{
      ItemId: string
      MinStack: number
      MaxStack: number
      Quality: number
    }>
    MinutesUntilReady: number
  }> | null
  CustomFields: Record<string, string> | null
}

export interface RawFruitTree {
  Seasons: Season[]
  Fruit: Array<{
    ItemId: string
    Chance: number
    Season: Season | null
  }>
  DaysUntilMature: number
  Texture: string | null
  TextureSpriteRow: number
  CustomFields: Record<string, string> | null
}

export interface ProcessedCrop {
  seedId: string
  harvestItemId: string
  name: string
  seasons: Season[]
  growthDays: number
  regrowDays: number | null
  sellPrice: number
  edibility: number
  isRaised: boolean
  isPaddyCrop: boolean
  harvestMethod: HarvestMethod
  minHarvest: number
  maxHarvest: number
  extraHarvestChance: number
  spriteIndex: number
  spriteSheet: string
  contextTags: string[]
  ccBundle: string | null
  _calc: {
    estimatedHarvests28Days: number
    estimatedNetProfit28Days: number
    profitPerDay: number
  }
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedObject {
  id: string
  name: string
  type: string
  category: number
  sellPrice: number
  edibility: number
  isDrink: boolean
  canBeGivenAsGift: boolean
  contextTags: string[]
  spriteIndex: number
  spriteSheet: string | null
  excludeFromShipping: boolean
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedFish {
  id: string
  name: string
  sellPrice: number
  edibility: number
  contextTags: string[]
  spriteIndex: number
  locations: string[]
  seasons: Season[]
  weather: string[]
  timeRanges: string[]
  difficulty: number
  behavior: string
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedNPC {
  name: string
  lovedGifts: string[]
  likedGifts: string[]
  dislikedGifts: string[]
  hatedGifts: string[]
  neutralGifts: string[]
  birthday: { season: Season; day: number } | null
  isMarriageCandidate: boolean
  portraitSprite: string | null
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedBuilding {
  id: string
  name: string
  description: string
  buildCost: number
  buildDays: number
  buildMaterials: Array<{ itemId: string; amount: number; name: string }>
  maxOccupants: number
  hayCapacity: number
  builder: string
  isMagical: boolean
  texture: string
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedMonster {
  id: string
  name: string
  health: number
  damage: number
  speed: number
  experienceGained: number
  minCoins: number
  maxCoins: number
  drops: Array<{ itemId: string; name: string; chance: number }>
  isMineMonster: boolean
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedWeapon {
  id: string
  name: string
  description: string
  type: number
  minDamage: number
  maxDamage: number
  speed: number
  critChance: number
  critMultiplier: number
  knockback: number
  spriteIndex: number
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedBundle {
  id: string
  name: string
  room: string
  reward: string
  color: number
  picksRequired: number | null
  ingredients: Array<{
    itemId: string
    name: string
    stack: number
    quality: number
  }>
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedRecipe {
  id: string
  name: string
  type: "cooking" | "crafting"
  outputItemId: string
  outputItemName: string
  outputStack: number
  ingredients: Array<{ itemId: string; name: string; amount: number }>
  unlockCondition: string
  _unknownFields?: Record<string, unknown>
}

export interface SpriteMetadata {
  id: string
  name: string
  category: string
  spriteSheet: string
  spriteIndex: number
  x: number
  y: number
  width: number
  height: number
  outputPath: string
}
