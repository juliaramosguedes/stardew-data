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
  RawTool,
  RawFruitTree,
  RawMachine,
  RawBigCraftable,
  RawSpecialOrder,
  RawWildTree,
  RawTailoringRecipe,
  RawMonsterSlayerQuest,
  RawFishPondData,
  RawFarmAnimal,
  RawShirt,
  RawPants,
  RawTrinket,
  RawGiantCrop,
  RawMuseumReward,
  RawBuff,
  RawFloor,
  RawPet,
  RawGarbageCan,
  RawMannequin,
  RawFence,
} from "./schemas/raw.ts"

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

export interface ProcessedTool {
  id: string
  name: string
  upgradeLevel: number
  salePrice: number
  spriteIndex: number
  texture: string | null
  upgradeFrom: string | null
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedFruitTree {
  id: string
  name: string
  seasons: Season[]
  daysUntilMature: number
  fruit: Array<{ itemId: string; name: string; chance: number; season: Season | null }>
  spriteRow: number
  texture: string | null
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedMachine {
  id: string
  name: string
  hasInput: boolean
  hasOutput: boolean
  outputRules: Array<{
    id: string
    minutesUntilReady: number
    outputItems: Array<{ itemId: string; name: string; minStack: number; maxStack: number }>
  }>
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedQuest {
  id: string
  type: string
  title: string
  description: string
  objective: string
  target: string | null
  rewardMoney: number
  nextQuestId: string | null
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedTailoringRecipe {
  id: string
  firstItemTags: string[]
  secondItemTags: string[]
  spendRightItem: boolean
  craftedItemId: string | null
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedMonsterSlayerQuest {
  id: string
  targets: string[]
  count: number
  rewardItemId: string | null
  rewardItemName: string
  rewardItemPrice: number
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedFishPond {
  id: string
  requiredTags: string[]
  maxPopulation: number
  produceChanceMin: number
  produceChanceMax: number
  producedItems: Array<{ itemId: string; name: string; requiredPopulation: number; chance: number }>
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedFarmAnimal {
  id: string
  house: string
  purchasePrice: number
  sellPrice: number
  produce: Array<{ itemId: string; name: string }>
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedHat {
  id: string
  name: string
  description: string
  showRealHair: boolean
  spriteIndex: number
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedShirt {
  id: string
  name: string
  sellPrice: number
  spriteIndex: number
  spriteSheet: string | null
  canBeDyed: boolean
  isPrismatic: boolean
  hasSleeves: boolean
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedPants {
  id: string
  name: string
  sellPrice: number
  spriteIndex: number
  spriteSheet: string | null
  canBeDyed: boolean
  isPrismatic: boolean
  defaultColor: string | null
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedTrinket {
  id: string
  texture: string
  sheetIndex: number
  effectClass: string
  dropsNaturally: boolean
  canBeReforged: boolean
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedWildTree {
  id: string
  seedItemId: string
  seedName: string
  growthChance: number
  tapItems: Array<{ itemId: string; name: string; daysUntilReady: number; chance: number }>
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedSpecialOrder {
  id: string
  requester: string
  duration: string
  repeatable: boolean
  orderType: string
  objectives: Array<{ type: string; requiredCount: number; acceptedTags: string[] }>
  rewards: Array<{ type: string }>
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedBook {
  id: string
  name: string
  sellPrice: number
  contextTags: string[]
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedFurniture {
  id: string
  name: string
  type: string
  sellPrice: number
  tileSizeX: number
  tileSizeY: number
  rotations: number
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedFence {
  id: string
  health: number
  repairHealthMin: number
  repairHealthMax: number
  texture: string
  placementSound: string
  removalSound: string
}

export interface ProcessedMannequin {
  id: string
  displayName: string
  description: string
  texture: string
  sheetIndex: number
  displaysClothingAsMale: boolean
  cursed: boolean
}

export interface ProcessedGarbageCan {
  id: string
  baseChance: number | null
  items: Array<{ id: string; itemId: string | null; condition: string | null }>
}

export interface ProcessedPet {
  id: string
  displayName: string
  barkSound: string
  moveSpeed: number
}

export interface ProcessedFloor {
  id: string
  itemId: string
  texture: string
  cornerX: number
  cornerY: number
  footstepSound: string
  connectType: string
  farmSpeedBuff: number | null
}

export interface ProcessedBuff {
  id: string
  displayName: string
  description: string | null
  isDebuff: boolean
  duration: number
  iconTexture: string
  iconSpriteIndex: number
  effects: Record<string, number> | null
}

export interface ProcessedMuseumReward {
  id: string
  targetContextTags: Array<{ tag: string; count: number }>
  rewardItemId: string | null
  rewardItemCount: number
  rewardItemIsSpecial: boolean
  rewardItemIsRecipe: boolean
}

export interface ProcessedGiantCrop {
  id: string
  fromItemId: string
  fromItemName: string
  harvestItems: Array<{ itemId: string; name: string; minStack: number; maxStack: number; chance: number }>
  spawnChance: number
  health: number
}

export interface ProcessedAchievement {
  id: string
  name: string
  description: string
  showProgressBar: boolean
  prerequisiteId: number | null
  spriteIndex: number
}

export interface ProcessedBoots {
  id: string
  name: string
  description: string
  sellPrice: number
  defense: number
  immunity: number
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedBigCraftable {
  id: string
  name: string
  sellPrice: number
  fragility: number
  canBePlacedOutdoors: boolean
  canBePlacedIndoors: boolean
  isLamp: boolean
  spriteIndex: number
  spriteSheet: string | null
  contextTags: string[]
  _unknownFields?: Record<string, unknown>
}

export interface ProcessedLocation {
  id: string
  fish: Array<{ itemId: string; name: string; chance: number }>
}

export interface ProcessedShop {
  id: string
  owners: string[]
  items: Array<{ itemId: string; name: string; price: number; stock: number }>
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
