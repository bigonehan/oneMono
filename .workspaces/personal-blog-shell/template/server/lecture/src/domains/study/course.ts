export interface Course {
  id: string;
  title: string;
  intro: string;
  detail: string;
  category: string;
  price: number;
}

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'NestJS GraphQL 실전',
    intro: 'NestJS로 GraphQL API를 구축합니다.',
    detail: 'Relay pagination, 인증, 도메인 분리까지 실습합니다.',
    category: '개발',
    price: 99000
  },
  {
    id: 'c2',
    title: 'Astro 강의 사이트 제작',
    intro: 'Astro 기반 SSR 페이지를 구성합니다.',
    detail: '메인/인트로/디테일/유저 페이지와 API 연동을 구현합니다.',
    category: '개발',
    price: 79000
  }
];

export function upsertCourse(course: Course): Course {
  const index = courses.findIndex((item) => item.id === course.id);
  if (index >= 0) {
    courses[index] = course;
    return courses[index];
  }
  courses.push(course);
  return course;
}
