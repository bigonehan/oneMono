import { Footer, SimpleCarousel } from "@ui/shadcn";

const slides = [
  {
    title: "Fast Setup",
    body: "바로 확장 가능한 템플릿 구조로 메인 흐름을 빠르게 구성합니다.",
  },
  {
    title: "Responsive First",
    body: "모바일부터 데스크톱까지 navbar와 섹션이 자연스럽게 전환됩니다.",
  },
  {
    title: "Composable UI",
    body: "공통 UI는 @ui/shadcn 패키지 컴포넌트 중심으로 조합됩니다.",
  },
];

const features = [
  { title: "Main", description: "Hero, carousel, feature, footer 섹션으로 시작 화면을 구성" },
  { title: "Profile", description: "카드형 carousel과 badge 세트로 사용자 소개 정보를 배치" },
  { title: "QA", description: "게시판 리스트와 채팅 토글 버튼으로 문의 흐름을 제공" },
];

export default function MainPage() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <p className="landing-hero__eyebrow">Template Landing</p>
        <h1>Main</h1>
        <p>기본 랜딩 페이지 구성 요소를 한 화면에서 확인할 수 있습니다.</p>
      </section>

      <SimpleCarousel
        ariaLabel="Main carousel"
        className="landing-carousel"
        items={slides.map((slide) => (
          <article key={slide.title} className="landing-carousel__card">
            <h2>{slide.title}</h2>
            <p>{slide.body}</p>
          </article>
        ))}
      />

      <section className="landing-feature" aria-labelledby="main-features">
        <h2 id="main-features">Features</h2>
        <ul>
          {features.map((feature) => (
            <li key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
}
