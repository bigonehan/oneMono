const endpoints = [
  process.env.LECTURE_API_URL,
  'http://127.0.0.1:4000/graphql',
  'http://localhost:4000/graphql'
].filter(Boolean) as string[];

const fallbackCourses = [
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
] as const;

const fallbackLectures = [
  { id: 'l1', courseId: 'c1', title: 'Relay 기본 구조', durationSec: 1200 },
  { id: 'l2', courseId: 'c1', title: 'Cursor Pagination', durationSec: 1500 },
  { id: 'l3', courseId: 'c2', title: 'Astro SSR', durationSec: 1100 }
] as const;

const fallbackReviews = [
  { id: 'r1', courseId: 'c1', rating: 5, content: '실전 예제가 좋아서 끝까지 수강했습니다.' },
  { id: 'r2', courseId: 'c2', rating: 4, content: '기초 개념을 빠르게 정리하기 좋습니다.' }
] as const;

const fallbackUserPage = {
  user: { id: 'u1', name: 'Lee Student', email: 'student@lecture.dev', role: 'student' },
  enrollments: [
    { id: 'e1', courseId: 'c1', status: 'active' },
    { id: 'e2', courseId: 'c2', status: 'completed' }
  ],
  progresses: [
    { id: 'p1', percent: 45 },
    { id: 'p2', percent: 100 }
  ],
  certifications: [{ id: 'cert1', verifyUrl: '/verify/uuid-cert1' }],
  notifications: [{ id: 'n1', message: '새 강의 업데이트가 등록되었습니다.' }]
} as const;

function buildFallbackResponse<T>(
  query: string,
  variables: Record<string, unknown>
): T | null {
  if (query.includes('mainCourses')) {
    return {
      mainCourses: {
        edges: fallbackCourses.map((course) => ({ node: { ...course } }))
      }
    } as T;
  }

  if (query.includes('introCourse')) {
    const id = typeof variables.id === 'string' ? variables.id : '';
    return {
      introCourse: fallbackCourses.find((course) => course.id === id) ?? null
    } as T;
  }

  if (query.includes('detailCourse')) {
    const id = typeof variables.id === 'string' ? variables.id : '';
    const course = fallbackCourses.find((item) => item.id === id);
    return {
      detailCourse: course
        ? {
            ...course,
            lectures: fallbackLectures.filter((lecture) => lecture.courseId === id),
            reviews: fallbackReviews.filter((review) => review.courseId === id)
          }
        : null
    } as T;
  }

  if (query.includes('userPage')) {
    return { userPage: fallbackUserPage } as T;
  }

  return null;
}

function isFetchUnavailable(error: unknown) {
  return error instanceof TypeError || (error instanceof Error && error.message === 'fetch failed');
}

export async function queryGraphQL<T>(query: string, variables: Record<string, unknown> = {}) {
  let lastError: Error | null = null;
  let fetchUnavailable = false;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query, variables })
      });

      const body = await response.json();
      if (!response.ok || body.errors?.length) {
        throw new Error(body.errors?.[0]?.message ?? 'GraphQL request failed');
      }

      return body.data as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('GraphQL request failed');
      fetchUnavailable ||= isFetchUnavailable(error);
    }
  }

  if (fetchUnavailable) {
    const fallback = buildFallbackResponse<T>(query, variables);
    if (fallback) return fallback;
  }

  throw new Error(lastError?.message ?? 'GraphQL request failed');
}
