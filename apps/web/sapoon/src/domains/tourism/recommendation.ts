import { listMockTouristAttractions } from "./mockTourismRepository";
import type { BurdenLevel, ComfortGrade, Recommendation, TouristAttraction, WalkingProfile } from "./schema";

const burdenWeight: Record<BurdenLevel, number> = {
  low: 0,
  medium: 14,
  high: 30,
};

const sensitivityWeight: Record<BurdenLevel, number> = {
  low: 0.7,
  medium: 1,
  high: 1.35,
};

function scoreAttraction(attraction: TouristAttraction, profile: WalkingProfile): number {
  const timePenalty = Math.max(0, attraction.expectedWalkingMinutes - profile.walkingTimeMinutes) * 1.2;
  const slopePenalty = burdenWeight[attraction.slopeLevel] * sensitivityWeight[profile.slopeBurden];
  const stairPenalty = burdenWeight[attraction.stairLevel] * sensitivityWeight[profile.stairBurden];
  const benchPenalty = Math.max(0, attraction.benchIntervalMeters - 60) * 0.16;
  const restroomPenalty = Math.max(0, attraction.restroomDistanceMeters - 120) * 0.08;
  const restAreaPenalty = Math.max(0, attraction.restAreaDistanceMeters - 100) * 0.08;
  const devicePenalty =
    profile.assistiveDevice === "none"
      ? 0
      : attraction.walkerFriendly && attraction.accessiblePath
        ? 0
        : 24;
  const comfortBonus = Number(attraction.accessiblePath) * 8 + Number(attraction.voiceGuideReady) * 4;

  return Math.max(
    0,
    Math.round(100 - timePenalty - slopePenalty - stairPenalty - benchPenalty - restroomPenalty - restAreaPenalty - devicePenalty + comfortBonus),
  );
}

function gradeFromScore(score: number): ComfortGrade {
  if (score >= 78) {
    return "veryComfortable";
  }

  if (score >= 54) {
    return "normal";
  }

  return "caution";
}

function buildReasons(attraction: TouristAttraction, score: number): Array<string> {
  const reasons = [
    `${attraction.expectedWalkingMinutes}분 정도로 둘러볼 수 있어요.`,
    `벤치는 약 ${attraction.benchIntervalMeters}m 간격으로 쉬어갈 수 있어요.`,
  ];

  if (attraction.slopeLevel === "low") {
    reasons.push("오르막 부담이 낮은 편이에요.");
  }

  if (attraction.restroomDistanceMeters <= 120) {
    reasons.push("가까운 화장실을 찾기 쉬워요.");
  }

  if (attraction.walkerFriendly) {
    reasons.push("지팡이나 보행보조기 이용을 고려한 길이에요.");
  }

  if (score < 54) {
    reasons.push("짧은 구간만 선택해서 방문하는 편이 좋아요.");
  }

  return reasons.slice(0, 4);
}

function buildWarnings(attraction: TouristAttraction, profile: WalkingProfile): Array<string> {
  const warnings: Array<string> = [];

  if (attraction.expectedWalkingMinutes > profile.walkingTimeMinutes) {
    warnings.push("선택한 보행 가능 시간보다 코스가 길 수 있어요.");
  }

  if (attraction.slopeLevel === "high" || attraction.stairLevel === "high") {
    warnings.push("경사나 계단 부담이 큰 구간이 있어요.");
  }

  if (profile.assistiveDevice !== "none" && !attraction.walkerFriendly) {
    warnings.push("보행보조기 사용자는 일부 구간 이동이 불편할 수 있어요.");
  }

  if (attraction.restroomDistanceMeters > 180) {
    warnings.push("화장실까지 거리가 있어 미리 들르는 편이 좋아요.");
  }

  return warnings;
}

export function recommendAttractions(profile: WalkingProfile): Array<Recommendation> {
  return listMockTouristAttractions()
    .filter((attraction) => profile.region === "전국" || attraction.region === profile.region)
    .map((attraction) => {
      const score = scoreAttraction(attraction, profile);

      return {
        attraction,
        score,
        grade: gradeFromScore(score),
        reasons: buildReasons(attraction, score),
        warnings: buildWarnings(attraction, profile),
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 10);
}

export const defaultWalkingProfile: WalkingProfile = {
  region: "전국",
  walkingTimeMinutes: 60,
  slopeBurden: "medium",
  stairBurden: "high",
  assistiveDevice: "cane",
};
