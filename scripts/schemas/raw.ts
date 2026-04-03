import { z } from "zod"

const customFields = z.record(z.string(), z.string()).nullable()
const season = z.enum(["Spring", "Summer", "Fall", "Winter"])

export const RawObjectSchema = z.object({
  Name: z.string(),
  DisplayName: z.string(),
  Description: z.string(),
  Type: z.string(),
  Category: z.number(),
  Price: z.number(),
  Texture: z.string().nullable(),
  SpriteIndex: z.number(),
  Edibility: z.number(),
  IsDrink: z.boolean(),
  Buffs: z.unknown().nullable(),
  ContextTags: z.array(z.string()).nullable(),
  CanBeGivenAsGift: z.boolean(),
  ExcludeFromShippingCollection: z.boolean(),
  CustomFields: customFields,
}).passthrough()

export const RawCropSchema = z.object({
  Seasons: z.array(season),
  DaysInPhase: z.array(z.number()),
  RegrowDays: z.number(),
  IsRaised: z.boolean(),
  IsPaddyCrop: z.boolean(),
  NeedsWatering: z.boolean(),
  HarvestItemId: z.string(),
  HarvestMinStack: z.number(),
  HarvestMaxStack: z.number(),
  HarvestMaxIncreasePerFarmingLevel: z.number(),
  ExtraHarvestChance: z.number(),
  HarvestMethod: z.enum(["Grab", "Scythe"]),
  HarvestMinQuality: z.number(),
  HarvestMaxQuality: z.number().nullable(),
  TintColors: z.array(z.string()),
  Texture: z.string().nullable(),
  SpriteIndex: z.number(),
  CountForMonoculture: z.boolean(),
  CountForPolyculture: z.boolean(),
  CustomFields: customFields,
}).passthrough()

export const RawBuildingSchema = z.object({
  Name: z.string(),
  Description: z.string(),
  Texture: z.string(),
  BuildCost: z.number(),
  BuildMaterials: z.array(z.object({ ItemId: z.string(), Amount: z.number() })).nullable(),
  BuildDays: z.number(),
  MagicalConstruction: z.boolean(),
  Builder: z.string(),
  MaxOccupants: z.number(),
  HayCapacity: z.number(),
  CustomFields: customFields,
}).passthrough()

export const RawWeaponSchema = z.object({
  Name: z.string(),
  DisplayName: z.string(),
  Description: z.string(),
  MinDamage: z.number(),
  MaxDamage: z.number(),
  Knockback: z.number(),
  Speed: z.number(),
  Precision: z.number(),
  Defense: z.number(),
  Type: z.number(),
  AreaOfEffect: z.number(),
  CritChance: z.number(),
  CritMultiplier: z.number(),
  Texture: z.string().nullable(),
  SpriteIndex: z.number(),
  CustomFields: customFields,
}).passthrough()

export const RawFishSchema = z.object({
  Name: z.string(),
  DisplayName: z.string(),
  Description: z.string(),
  Type: z.string(),
  Category: z.number(),
  Price: z.number(),
  Texture: z.string().nullable(),
  SpriteIndex: z.number(),
  Edibility: z.number(),
  IsDrink: z.boolean(),
  ContextTags: z.array(z.string()).nullable(),
  SpawnData: z.array(z.object({
    Season: z.string().nullable(),
    Location: z.string().nullable(),
    Time: z.string().nullable(),
    Weather: z.string().nullable(),
    MinFishingLevel: z.number(),
    Chance: z.number(),
  }).passthrough()).nullish(),
  IsBossFish: z.boolean().optional(),
  Difficulty: z.number().optional(),
  BehaviorType: z.string().optional(),
  CustomFields: customFields,
}).passthrough()

export const RawCharacterSchema = z.object({
  DisplayName: z.string(),
  Birthday_Season: z.string().nullish(),
  Birthday_Day: z.coerce.number().optional(),
  HomeRegion: z.string(),
  Age: z.unknown(),
  Manner: z.unknown(),
  SocialAnxiety: z.unknown(),
  Optimism: z.unknown(),
  Gender: z.unknown(),
  IsDatable: z.boolean().optional(),
  CanBeRomanced: z.boolean().optional(),
  LoveInterest: z.string().nullable().optional(),
  CustomFields: customFields,
}).passthrough()

export const MonsterParsedSchema = z.object({
  health:           z.coerce.number(),
  damageToFarmer:   z.coerce.number(),
  minCoins:         z.coerce.number(),
  maxCoins:         z.coerce.number(),
  isGlider:         z.string().transform(s => s === "true"),
  resilience:       z.coerce.number(),
  objectsToDrop:    z.string(),
  jitteriness:      z.coerce.number(),
  missChance:       z.coerce.number(),
  speed:            z.coerce.number(),
  experienceGained: z.coerce.number(),
  fearLevel:        z.coerce.number(),
  isMineMonster:    z.string().transform(s => s === "true"),
  slipperiness:     z.coerce.number(),
  displayName:      z.string(),
})

export const BundleParsedSchema = z.object({
  name:          z.string(),
  reward:        z.string(),
  ingredients:   z.string(),
  color:         z.coerce.number(),
  picksRequired: z.string().transform(s => s !== "" ? parseInt(s) : null),
  unused:        z.string(),
  displayName:   z.string(),
})

export const RecipeParsedSchema = z.object({
  ingredientPairs:  z.string(),
  unused1:          z.string(),
  outputPair:       z.string(),
  unused2:          z.string().optional(),
  unlockCondition:  z.string(),
})

export const NpcGiftTastesParsedSchema = z.object({
  loveText:    z.string(),
  loveIds:     z.string(),
  likeText:    z.string(),
  likeIds:     z.string(),
  dislikeText: z.string(),
  dislikeIds:  z.string(),
  hateText:    z.string(),
  hateIds:     z.string(),
  neutralText: z.string(),
  neutralIds:  z.string(),
})

export const RawToolSchema = z.object({
  Name: z.string(),
  SalePrice: z.number(),
  Texture: z.string().nullable(),
  SpriteIndex: z.number(),
  UpgradeLevel: z.number(),
  ConventionalUpgradeFrom: z.string().nullable(),
  CustomFields: customFields,
}).passthrough()

export const RawFruitTreeSchema = z.object({
  Seasons: z.array(season),
  DaysUntilMature: z.number().optional().default(28),
  Fruit: z.array(z.object({
    ItemId: z.string(),
    Chance: z.number(),
    Season: season.nullable().optional(),
  }).passthrough()),
  Texture: z.string().nullable(),
  TextureSpriteRow: z.number(),
  CustomFields: customFields,
}).passthrough()

export const RawMachineSchema = z.object({
  HasInput: z.boolean(),
  HasOutput: z.boolean(),
  OutputRules: z.array(z.object({
    Id: z.string(),
    OutputItem: z.array(z.object({
      ItemId: z.string().nullable(),
      MinStack: z.number(),
      MaxStack: z.number(),
    }).passthrough()).nullable().optional(),
    MinutesUntilReady: z.number(),
  }).passthrough()).nullable(),
  CustomFields: customFields,
}).passthrough()

export const HatParsedSchema = z.object({
  name: z.string(),
  description: z.string(),
  showRealHair: z.string().transform(s => s === "true"),
  skipHairstyleOffset: z.string().transform(s => s === "true"),
  metadata: z.string().optional(),
  displayName: z.string(),
})

export const RawShirtSchema = z.object({
  Name: z.string(),
  Price: z.number(),
  Texture: z.string().nullable(),
  SpriteIndex: z.number(),
  CanBeDyed: z.boolean(),
  IsPrismatic: z.boolean(),
  HasSleeves: z.boolean(),
  CustomFields: customFields,
}).passthrough()

export const RawPantsSchema = z.object({
  Name: z.string(),
  Price: z.number(),
  Texture: z.string().nullable(),
  SpriteIndex: z.number(),
  CanBeDyed: z.boolean(),
  IsPrismatic: z.boolean(),
  DefaultColor: z.string().nullable(),
  CustomFields: customFields,
}).passthrough()

export const RawTrinketSchema = z.object({
  Texture: z.string(),
  SheetIndex: z.number(),
  TrinketEffectClass: z.string(),
  DropsNaturally: z.boolean(),
  CanBeReforged: z.boolean(),
  CustomFields: customFields,
}).passthrough()

export const FurnitureParsedSchema = z.object({
  name: z.string(),
  type: z.string(),
  tileSize: z.string(),
  boundingBox: z.string(),
  rotations: z.coerce.number(),
  price: z.coerce.number(),
  placementRestriction: z.coerce.number(),
  displayName: z.string(),
})

export const BootsParsedSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  defense: z.coerce.number(),
  immunity: z.coerce.number(),
  colorIndex: z.coerce.number(),
  displayName: z.string(),
})

export const RawTailoringRecipeSchema = z.object({
  Id: z.string(),
  FirstItemTags: z.array(z.string()).nullable(),
  SecondItemTags: z.array(z.string()).nullable(),
  SpendRightItem: z.boolean(),
  CraftedItemId: z.string().nullable(),
  CraftedItemIds: z.array(z.string()).nullable(),
}).passthrough()

export const RawMonsterSlayerQuestSchema = z.object({
  Targets: z.array(z.string()),
  Count: z.number(),
  RewardItemId: z.string().nullable(),
  RewardItemPrice: z.number(),
  CustomFields: customFields,
}).passthrough()

export const RawFishPondDataSchema = z.object({
  Id: z.string(),
  RequiredTags: z.array(z.string()).nullable(),
  MaxPopulation: z.number(),
  BaseMinProduceChance: z.number(),
  BaseMaxProduceChance: z.number(),
  ProducedItems: z.array(z.object({
    ItemId: z.string().nullable(),
    RequiredPopulation: z.number(),
    Chance: z.number(),
  }).passthrough()).nullable(),
}).passthrough()

export const RawFarmAnimalSchema = z.object({
  House: z.string(),
  Gender: z.string(),
  PurchasePrice: z.number(),
  SellPrice: z.number(),
  ProduceItemIds: z.array(z.object({
    Id: z.string(),
    ItemId: z.string(),
    Condition: z.string().nullable(),
    MinimumFriendship: z.number(),
  }).passthrough()).nullable(),
  CustomFields: customFields,
}).passthrough()

export const RawWildTreeSchema = z.object({
  SeedItemId: z.string(),
  SeedPlantable: z.boolean(),
  GrowthChance: z.number(),
  DropWoodOnChop: z.boolean().optional(),
  DropHardwoodOnLumberChop: z.boolean().optional(),
  TapItems: z.array(z.object({
    ItemId: z.string().nullable(),
    DaysUntilReady: z.number(),
    Chance: z.number(),
  }).passthrough()).nullable(),
  CustomFields: customFields,
}).passthrough()

export const RawSpecialOrderSchema = z.object({
  Name: z.string(),
  Requester: z.string(),
  Duration: z.string(),
  Repeatable: z.boolean(),
  OrderType: z.string(),
  Objectives: z.array(z.object({
    Type: z.string(),
    RequiredCount: z.coerce.number().catch(-1),
    Data: z.record(z.string(), z.string()).nullable().optional(),
  }).passthrough()),
  Rewards: z.array(z.object({
    Type: z.string(),
    Data: z.record(z.string(), z.string()).nullable().optional(),
  }).passthrough()).nullable(),
  CustomFields: customFields,
}).passthrough()

export const RawBigCraftableSchema = z.object({
  Name: z.string(),
  Price: z.number(),
  Fragility: z.number(),
  CanBePlacedOutdoors: z.boolean(),
  CanBePlacedIndoors: z.boolean(),
  IsLamp: z.boolean(),
  Texture: z.string().nullable(),
  SpriteIndex: z.number(),
  ContextTags: z.array(z.string()).nullable(),
  CustomFields: customFields,
}).passthrough()

const rawGarbageItem = z.object({
  Id: z.string(),
  ItemId: z.string().nullable(),
  Condition: z.string().nullable(),
}).passthrough()

export const RawGarbageCanSchema = z.object({
  BaseChance: z.number(),
  Items: z.array(rawGarbageItem),
  CustomFields: customFields,
}).passthrough()

export const RawGarbageCansFileSchema = z.object({
  DefaultBaseChance: z.number(),
  GarbageCans: z.record(z.string(), RawGarbageCanSchema),
}).passthrough()

export const RawFenceSchema = z.object({
  Health: z.number(),
  RepairHealthAdjustmentMinimum: z.number(),
  RepairHealthAdjustmentMaximum: z.number(),
  Texture: z.string(),
  PlacementSound: z.string(),
  RemovalSound: z.string(),
}).passthrough()

export const RawMannequinSchema = z.object({
  DisplayName: z.string(),
  Description: z.string(),
  Texture: z.string(),
  SheetIndex: z.number(),
  DisplaysClothingAsMale: z.boolean(),
  Cursed: z.boolean(),
  CustomFields: customFields,
}).passthrough()

export const RawPetSchema = z.object({
  DisplayName: z.string(),
  BarkSound: z.string(),
  MoveSpeed: z.number(),
}).passthrough()

export const RawFloorSchema = z.object({
  Id: z.string(),
  ItemId: z.string(),
  Texture: z.string(),
  Corner: z.object({ X: z.number(), Y: z.number() }),
  FootstepSound: z.string(),
  ConnectType: z.string(),
  FarmSpeedBuff: z.number(),
}).passthrough()

export const RawBuffSchema = z.object({
  DisplayName: z.string(),
  Description: z.string().nullable(),
  IsDebuff: z.boolean(),
  Duration: z.number(),
  IconTexture: z.string(),
  IconSpriteIndex: z.number(),
  Effects: z.record(z.string(), z.number()).nullable(),
  CustomFields: customFields,
}).passthrough()

export const RawMuseumRewardSchema = z.object({
  TargetContextTags: z.array(z.object({
    Tag: z.string(),
    Count: z.number(),
  })),
  RewardItemId: z.string().nullable(),
  RewardItemCount: z.number(),
  RewardItemIsSpecial: z.boolean(),
  RewardItemIsRecipe: z.boolean(),
  CustomFields: customFields,
}).passthrough()

export const RawGiantCropSchema = z.object({
  FromItemId: z.string(),
  HarvestItems: z.array(z.object({
    ItemId: z.string(),
    MinStack: z.number(),
    MaxStack: z.number(),
    Chance: z.number(),
  }).passthrough()),
  Chance: z.number(),
  Health: z.number(),
  CustomFields: customFields,
}).passthrough()

export const AchievementParsedSchema = z.object({
  name: z.string(),
  description: z.string(),
  showProgressBar: z.enum(["true", "false"]),
  prerequisiteId: z.coerce.number(),
  spriteIndex: z.coerce.number(),
})

export const QuestParsedSchema = z.object({
  type: z.string(),
  title: z.string(),
  description: z.string(),
  objective: z.string(),
  target: z.string(),
  rewardDetails: z.string(),
  rewardMoney: z.coerce.number(),
  nextQuestId: z.coerce.number(),
  isDailyQuest: z.string().optional(),
})

export type RawObject         = z.infer<typeof RawObjectSchema>
export type RawCrop           = z.infer<typeof RawCropSchema>
export type RawBuilding       = z.infer<typeof RawBuildingSchema>
export type RawWeapon         = z.infer<typeof RawWeaponSchema>
export type RawFish           = z.infer<typeof RawFishSchema>
export type RawCharacter      = z.infer<typeof RawCharacterSchema>
export type RawMonster        = z.infer<typeof MonsterParsedSchema>
export type RawBundle         = z.infer<typeof BundleParsedSchema>
export type RawRecipe         = z.infer<typeof RecipeParsedSchema>
export type RawTool           = z.infer<typeof RawToolSchema>
export type RawFruitTree      = z.infer<typeof RawFruitTreeSchema>
export type RawMachine        = z.infer<typeof RawMachineSchema>
export type RawBigCraftable   = z.infer<typeof RawBigCraftableSchema>
export type RawSpecialOrder   = z.infer<typeof RawSpecialOrderSchema>
export type RawWildTree       = z.infer<typeof RawWildTreeSchema>
export type RawTailoringRecipe    = z.infer<typeof RawTailoringRecipeSchema>
export type RawMonsterSlayerQuest = z.infer<typeof RawMonsterSlayerQuestSchema>
export type RawFishPondData       = z.infer<typeof RawFishPondDataSchema>
export type RawFarmAnimal     = z.infer<typeof RawFarmAnimalSchema>
export type RawShirt          = z.infer<typeof RawShirtSchema>
export type RawPants          = z.infer<typeof RawPantsSchema>
export type RawTrinket        = z.infer<typeof RawTrinketSchema>
export type RawGiantCrop      = z.infer<typeof RawGiantCropSchema>
export type RawMuseumReward   = z.infer<typeof RawMuseumRewardSchema>
export type RawBuff           = z.infer<typeof RawBuffSchema>
export type RawFloor          = z.infer<typeof RawFloorSchema>
export type RawPet            = z.infer<typeof RawPetSchema>
export type RawGarbageCan     = z.infer<typeof RawGarbageCanSchema>
export type RawMannequin      = z.infer<typeof RawMannequinSchema>
export type RawFence          = z.infer<typeof RawFenceSchema>

export function validateSample<T>(
  data: Record<string, T>,
  schema: z.ZodType<T>,
  n = 5
): void {
  const keys = Object.keys(data)
  const sample = keys.sort(() => Math.random() - 0.5).slice(0, n)
  for (const key of sample) {
    const result = schema.safeParse(data[key])
    if (!result.success) {
      throw new Error(
        `Schema validation failed for "${key}":\n` +
        result.error.issues.map(i => `  ${i.path.join(".")}: ${i.message}`).join("\n")
      )
    }
  }
}

export function detectAndCollect(
  parsed: Record<string, unknown>,
  knownKeys: Set<string>,
  context: string
): Record<string, unknown> | undefined {
  const extras = Object.fromEntries(
    Object.entries(parsed).filter(([k]) => !knownKeys.has(k))
  )
  if (Object.keys(extras).length === 0) return undefined
  console.warn(`New fields detected in "${context}": ${Object.keys(extras).join(", ")}`)
  return extras
}
