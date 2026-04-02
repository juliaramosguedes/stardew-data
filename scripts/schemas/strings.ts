export const MONSTER_FIELDS = [
  "health",
  "damageToFarmer",
  "minCoins",
  "maxCoins",
  "isGlider",
  "resilience",
  "objectsToDrop",
  "jitteriness",
  "missChance",
  "speed",
  "experienceGained",
  "fearLevel",
  "isMineMonster",
  "slipperiness",
  "displayName",
] as const

export const BUNDLE_FIELDS = [
  "name",
  "reward",
  "ingredients",
  "color",
  "picksRequired",
  "unused",
  "displayName",
] as const

export const COOKING_RECIPE_FIELDS = [
  "ingredientPairs",
  "unused1",
  "outputPair",
  "unlockCondition",
] as const

export const CRAFTING_RECIPE_FIELDS = [
  "ingredientPairs",
  "unused1",
  "outputPair",
  "unused2",
  "unlockCondition",
] as const

export const NPC_GIFT_TASTE_FIELDS = [
  "loveText",
  "loveIds",
  "likeText",
  "likeIds",
  "dislikeText",
  "dislikeIds",
  "hateText",
  "hateIds",
  "neutralText",
  "neutralIds",
] as const
