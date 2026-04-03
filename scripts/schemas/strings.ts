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

export const FURNITURE_FIELDS = [
  "name",
  "type",
  "tileSize",
  "boundingBox",
  "rotations",
  "price",
  "placementRestriction",
  "displayName",
] as const

export const HAT_FIELDS = [
  "name",
  "description",
  "showRealHair",
  "skipHairstyleOffset",
  "metadata",
  "displayName",
] as const

export const BOOTS_FIELDS = [
  "name",
  "description",
  "price",
  "defense",
  "immunity",
  "colorIndex",
  "displayName",
] as const

export const QUEST_FIELDS = [
  "type",
  "title",
  "description",
  "objective",
  "target",
  "rewardDetails",
  "rewardMoney",
  "nextQuestId",
  "isDailyQuest",
] as const
