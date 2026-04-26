import { SimpleCarousel, TagBadge } from "@ui/shadcn";

const cards = [
  { title: "Builder", summary: "설계부터 배포까지 연결하는 실행형 프로필 카드" },
  { title: "Product", summary: "기능 요구사항을 UI 흐름으로 변환하는 제품 카드" },
  { title: "Data", summary: "행동 로그와 피드백을 추적하는 분석 카드" },
];

const tags = ["frontend", "nextjs", "routing", "responsive", "ui-kit"];

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <h1>Profile</h1>
        <p>카드형 carousel과 tag badge 조합의 프로필 뷰입니다.</p>
      </header>

      <SimpleCarousel
        ariaLabel="Profile cards"
        className="profile-carousel"
        items={cards.map((card) => (
          <article key={card.title} className="profile-card">
            <h2>{card.title}</h2>
            <p>{card.summary}</p>
          </article>
        ))}
      />

      <div className="profile-tags" aria-label="Profile tags">
        {tags.map((tag) => (
          <TagBadge key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}
