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

export type RawObject    = z.infer<typeof RawObjectSchema>
export type RawCrop      = z.infer<typeof RawCropSchema>
export type RawBuilding  = z.infer<typeof RawBuildingSchema>
export type RawWeapon    = z.infer<typeof RawWeaponSchema>
export type RawFish      = z.infer<typeof RawFishSchema>
export type RawCharacter = z.infer<typeof RawCharacterSchema>
export type RawMonster   = z.infer<typeof MonsterParsedSchema>
export type RawBundle    = z.infer<typeof BundleParsedSchema>
export type RawRecipe    = z.infer<typeof RecipeParsedSchema>

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
