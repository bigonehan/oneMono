import { Schema } from "effect";

export const WalkingTimeSchema = Schema.Literal(30, 60, 90);
export type WalkingTime = Schema.Schema.Type<typeof WalkingTimeSchema>;

export const BurdenLevelSchema = Schema.Literal("low", "medium", "high");
export type BurdenLevel = Schema.Schema.Type<typeof BurdenLevelSchema>;

export const AssistiveDeviceSchema = Schema.Literal("none", "cane", "walker", "wheelchair");
export type AssistiveDevice = Schema.Schema.Type<typeof AssistiveDeviceSchema>;

export const WalkingProfileSchema = Schema.Struct({
  region: Schema.String,
  walkingTimeMinutes: WalkingTimeSchema,
  slopeBurden: BurdenLevelSchema,
  stairBurden: BurdenLevelSchema,
  assistiveDevice: AssistiveDeviceSchema,
});
export type WalkingProfile = Schema.Schema.Type<typeof WalkingProfileSchema>;

export const ComfortGradeSchema = Schema.Literal("veryComfortable", "normal", "caution");
export type ComfortGrade = Schema.Schema.Type<typeof ComfortGradeSchema>;

export const TouristAttractionSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  region: Schema.String,
  address: Schema.String,
  latitude: Schema.Number,
  longitude: Schema.Number,
  tourApiContentId: Schema.String,
  imageTone: Schema.String,
  summary: Schema.String,
  expectedWalkingMinutes: Schema.Number,
  slopeLevel: BurdenLevelSchema,
  stairLevel: BurdenLevelSchema,
  benchIntervalMeters: Schema.Number,
  restroomDistanceMeters: Schema.Number,
  restAreaDistanceMeters: Schema.Number,
  accessiblePath: Schema.Boolean,
  elevatorAvailable: Schema.Boolean,
  walkerFriendly: Schema.Boolean,
  voiceGuideReady: Schema.Boolean,
  cautionNote: Schema.String,
});
export type TouristAttraction = Schema.Schema.Type<typeof TouristAttractionSchema>;

export const RecommendationSchema = Schema.Struct({
  attraction: TouristAttractionSchema,
  score: Schema.Number,
  grade: ComfortGradeSchema,
  reasons: Schema.Array(Schema.String),
  warnings: Schema.Array(Schema.String),
});
export type Recommendation = Schema.Schema.Type<typeof RecommendationSchema>;

export const SavedTripSchema = Schema.Struct({
  attractionId: Schema.String,
  title: Schema.String,
  grade: ComfortGradeSchema,
});
export type SavedTrip = Schema.Schema.Type<typeof SavedTripSchema>;
