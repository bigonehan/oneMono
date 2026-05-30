"use client";

import { Button } from "@ui/shadcn";
import { type ReactNode, useMemo, useState } from "react";

import { listRegions } from "@/domains/tourism/mockTourismRepository";
import { defaultWalkingProfile, recommendAttractions } from "@/domains/tourism/recommendation";
import type { AssistiveDevice, BurdenLevel, Recommendation, SavedTrip, WalkingProfile, WalkingTime } from "@/domains/tourism/schema";

const burdenLabels: Record<BurdenLevel, string> = {
  low: "괜찮아요",
  medium: "조금 부담돼요",
  high: "많이 부담돼요",
};

const deviceLabels: Record<AssistiveDevice, string> = {
  none: "사용 안 함",
  cane: "지팡이",
  walker: "보행보조기",
  wheelchair: "휠체어",
};

const gradeLabels = {
  veryComfortable: "매우 편함",
  normal: "보통",
  caution: "주의",
} as const;

const gradeDescriptions = {
  veryComfortable: "오늘 바로 가도 부담이 낮아요.",
  normal: "천천히 쉬면서 다녀오면 좋아요.",
  caution: "짧은 구간만 고르는 편이 좋아요.",
} as const;

const walkingTimes = [30, 60, 90] satisfies Array<WalkingTime>;
const burdenLevels = ["low", "medium", "high"] satisfies Array<BurdenLevel>;
const deviceOptions = ["none", "cane", "walker", "wheelchair"] satisfies Array<AssistiveDevice>;

function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      className={`choice-button ${active ? "choice-button-active" : ""}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function RecommendationCard({
  recommendation,
  active,
  onSelect,
  onSave,
}: {
  recommendation: Recommendation;
  active: boolean;
  onSelect: () => void;
  onSave: () => void;
}) {
  const { attraction, grade, score, reasons, warnings } = recommendation;

  return (
    <article className={`result-card ${active ? "result-card-active" : ""}`}>
      <button className="result-card-button" type="button" onClick={onSelect}>
        <div className="card-visual" data-tone={attraction.imageTone}>
          <span>{attraction.region}</span>
        </div>
        <div className="card-content">
          <div className="card-heading">
            <span className={`grade-badge grade-${grade}`}>{gradeLabels[grade]}</span>
            <span className="score">{score}점</span>
          </div>
          <h3>{attraction.title}</h3>
          <p>{attraction.summary}</p>
          <p className="comfort-copy">{gradeDescriptions[grade]}</p>
        </div>
      </button>
      {active ? (
        <div className="detail-panel">
          <dl className="detail-grid">
            <div>
              <dt>예상 시간</dt>
              <dd>{attraction.expectedWalkingMinutes}분</dd>
            </div>
            <div>
              <dt>벤치 간격</dt>
              <dd>{attraction.benchIntervalMeters}m</dd>
            </div>
            <div>
              <dt>화장실</dt>
              <dd>{attraction.restroomDistanceMeters}m</dd>
            </div>
            <div>
              <dt>쉼터</dt>
              <dd>{attraction.restAreaDistanceMeters}m</dd>
            </div>
          </dl>
          <div className="reason-list">
            {reasons.map((reason) => (
              <p key={reason}>{reason}</p>
            ))}
          </div>
          {warnings.length > 0 ? (
            <div className="warning-box">
              {warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          ) : null}
          <p className="caution-note">{attraction.cautionNote}</p>
          <Button type="button" size="lg" className="save-button" onClick={onSave}>
            이곳으로 정했어요
          </Button>
        </div>
      ) : null}
    </article>
  );
}

export function SeniorTripApp() {
  const regions = useMemo(() => ["전국", ...listRegions()], []);
  const [profile, setProfile] = useState<WalkingProfile>(defaultWalkingProfile);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedTrips, setSavedTrips] = useState<Array<SavedTrip>>([]);
  const recommendations = useMemo(() => recommendAttractions(profile), [profile]);
  const selectedRecommendation = recommendations.find((recommendation) => recommendation.attraction.id === selectedId) ?? recommendations[0];

  function updateProfile(nextProfile: Partial<WalkingProfile>) {
    setProfile((current) => ({ ...current, ...nextProfile }));
    setSelectedId(null);
  }

  function saveTrip(recommendation: Recommendation) {
    setSavedTrips((current) => {
      if (current.some((trip) => trip.attractionId === recommendation.attraction.id)) {
        return current;
      }

      return [
        ...current,
        {
          attractionId: recommendation.attraction.id,
          title: recommendation.attraction.title,
          grade: recommendation.grade,
        },
      ];
    });
  }

  return (
    <main className="app-shell">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">TourAPI 활용 시니어 안심 여행</p>
          <h1 id="hero-title">편한걸음</h1>
          <p className="hero-description">내 무릎과 보행 속도에 맞춰 걷기 편한 관광지를 먼저 골라드립니다.</p>
        </div>
        <div className="hero-status">
          <span>질문 4개</span>
          <strong>터치만으로 추천</strong>
        </div>
      </section>

      <section className="question-section" aria-labelledby="question-title">
        <div className="section-heading">
          <p className="eyebrow">조건 입력</p>
          <h2 id="question-title">어디로, 얼마나 편하게 걸을까요?</h2>
        </div>

        <div className="question-block">
          <h3>희망 지역</h3>
          <div className="choice-grid">
            {regions.map((region) => (
              <ChoiceButton key={region} active={profile.region === region} onClick={() => updateProfile({ region })}>
                {region}
              </ChoiceButton>
            ))}
          </div>
        </div>

        <div className="question-block">
          <h3>걸을 수 있는 시간</h3>
          <div className="choice-grid three">
            {walkingTimes.map((walkingTimeMinutes) => (
              <ChoiceButton
                key={walkingTimeMinutes}
                active={profile.walkingTimeMinutes === walkingTimeMinutes}
                onClick={() => updateProfile({ walkingTimeMinutes })}
              >
                {walkingTimeMinutes}분
              </ChoiceButton>
            ))}
          </div>
        </div>

        <div className="question-block two-column">
          <div>
            <h3>오르막 부담</h3>
            <div className="choice-stack">
              {burdenLevels.map((slopeBurden) => (
                <ChoiceButton key={slopeBurden} active={profile.slopeBurden === slopeBurden} onClick={() => updateProfile({ slopeBurden })}>
                  {burdenLabels[slopeBurden]}
                </ChoiceButton>
              ))}
            </div>
          </div>
          <div>
            <h3>계단 부담</h3>
            <div className="choice-stack">
              {burdenLevels.map((stairBurden) => (
                <ChoiceButton key={stairBurden} active={profile.stairBurden === stairBurden} onClick={() => updateProfile({ stairBurden })}>
                  {burdenLabels[stairBurden]}
                </ChoiceButton>
              ))}
            </div>
          </div>
        </div>

        <div className="question-block">
          <h3>보조기구</h3>
          <div className="choice-grid">
            {deviceOptions.map((assistiveDevice) => (
              <ChoiceButton
                key={assistiveDevice}
                active={profile.assistiveDevice === assistiveDevice}
                onClick={() => updateProfile({ assistiveDevice })}
              >
                {deviceLabels[assistiveDevice]}
              </ChoiceButton>
            ))}
          </div>
        </div>
      </section>

      <section className="results-section" aria-labelledby="results-title">
        <div className="section-heading">
          <p className="eyebrow">추천 보기</p>
          <h2 id="results-title">걷기 부담이 낮은 순서입니다</h2>
        </div>

        <div className="map-panel" aria-label="추천 관광지 위치 요약">
          {recommendations.slice(0, 5).map((recommendation, index) => (
            <button
              key={recommendation.attraction.id}
              className={`map-pin grade-${recommendation.grade}`}
              style={{
                left: `${18 + index * 15}%`,
                top: `${32 + (index % 3) * 16}%`,
              }}
              type="button"
              onClick={() => setSelectedId(recommendation.attraction.id)}
              aria-label={`${recommendation.attraction.title} 선택`}
            >
              {index + 1}
            </button>
          ))}
          <div className="map-copy">
            <strong>{selectedRecommendation?.attraction.title}</strong>
            <span>{selectedRecommendation ? `${selectedRecommendation.attraction.address}` : "추천 결과가 없습니다."}</span>
          </div>
        </div>

        <div className="result-list">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.attraction.id}
              recommendation={recommendation}
              active={(selectedId ?? recommendations[0]?.attraction.id) === recommendation.attraction.id}
              onSelect={() => setSelectedId(recommendation.attraction.id)}
              onSave={() => saveTrip(recommendation)}
            />
          ))}
        </div>
      </section>

      <section className="saved-section" aria-labelledby="saved-title">
        <div className="section-heading">
          <p className="eyebrow">나의 편한 여행</p>
          <h2 id="saved-title">저장한 장소</h2>
        </div>
        {savedTrips.length > 0 ? (
          <ul className="saved-list">
            {savedTrips.map((trip) => (
              <li key={trip.attractionId}>
                <strong>{trip.title}</strong>
                <span>{gradeLabels[trip.grade]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">마음에 드는 추천 카드에서 저장 버튼을 눌러보세요.</p>
        )}
      </section>
    </main>
  );
}
