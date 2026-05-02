import { ListBlogShowcase, SimpleCarousel } from "@ui/shadcn";
import { FullscreenScroller } from "./_components/fullscreen-scroller";

const slides = [
  {
    title: "Bare Next",
    body: "App Router, 공통 navbar, fullscreen section만 남긴 시작점입니다.",
  },
  {
    title: "Shared UI",
    body: "@ui/shadcn 컴포넌트를 직접 import해서 화면 골격을 구성합니다.",
  },
  {
    title: "GSAP Scroll",
    body: "섹션 단위 이동은 GSAP easing으로 부드럽게 처리합니다.",
  },
];

const showcase = {
  featured: {
    path: "barebone",
    title: "Reusable Body Section",
    description:
      "ListBlogShowcase를 body section 안에 넣어 템플릿의 기본 콘텐츠 영역으로 사용합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    labels: ["Next", "UI"],
    date: "Template",
  },
  items: [
    {
      path: "navbar",
      title: "Navbar",
      description: "Header 컴포넌트를 확장해 템플릿 navbar로 가져왔습니다.",
      imageUrl:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
      labels: ["shadcn"],
    },
    {
      path: "scroll",
      title: "Scroll Sections",
      description: "한 화면 섹션을 기준으로 wheel과 touch 이동을 보정합니다.",
      imageUrl:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
      labels: ["gsap"],
    },
  ],
};

export default function MainPage() {
  return (
    <FullscreenScroller>
      <section className="screen-section screen-section--hero" id="hero" data-scroll-section>
        <div className="screen-section__content">
          <p className="screen-section__eyebrow">Template Web Next</p>
          <h1>Next Barebone</h1>
          <p>navbar, body section, GSAP fullscreen scroll을 갖춘 최소 Next 템플릿입니다.</p>
        </div>
      </section>

      <section
        className="screen-section screen-section--showcase"
        id="showcase"
        data-scroll-section
      >
        <ListBlogShowcase featured={showcase.featured} items={showcase.items} />
      </section>

      <section
        className="screen-section screen-section--sections"
        id="sections"
        data-scroll-section
      >
        <SimpleCarousel
          ariaLabel="Template sections"
          className="landing-carousel"
          items={slides.map((slide) => (
            <article key={slide.title} className="landing-carousel__card">
              <h2>{slide.title}</h2>
              <p>{slide.body}</p>
            </article>
          ))}
        />
      </section>
    </FullscreenScroller>
  );
}
