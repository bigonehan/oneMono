import type { Post } from "@domains/post"
import { PostId } from "@domains/post"
import { UserId } from "@domains/user"

export const mockPosts: ReadonlyArray<Post> = [
  {
    id: PostId("post-1"),
    title: "Effect 기반 보드 시스템 구상",
    body: "Effect 브랜드 타입과 Schema로 정의된 도메인 모델을 사용해 게시글을 나눠봅니다.",
    createdAt: new Date("2024-10-01T09:15:00Z"),
    user: {
      id: UserId("user-1"),
      name: "도메인 설계자"
    }
  },
  {
    id: PostId("post-2"),
    title: "Supabase 어댑터 작성기",
    body: "포트/어댑터 패턴으로 Supabase 연동 레이어를 분리하면 테스트가 훨씬 쉬워집니다.",
    createdAt: new Date("2024-10-05T13:40:00Z"),
    user: {
      id: UserId("user-2"),
      name: "백엔드 마법사"
    }
  },
  {
    id: PostId("post-3"),
    title: "Mock 데이터로 UI 확인",
    body: "실제 API가 준비되지 않아도 도메인 객체만 있으면 UI/UX 플로우를 충분히 검증할 수 있어요.",
    createdAt: new Date("2024-10-09T18:05:00Z"),
    user: {
      id: UserId("user-3"),
      name: "프런트 협력자"
    }
  }
]
