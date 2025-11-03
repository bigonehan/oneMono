
/**
 * 게시글을 나타내는 도메인 모델
 */
export interface Post {
  id: string
  user: string     // 간단히 name만 string으로
  body: string
  createdAt: Date
  modifiedAt?: Date
}

/**
 * 새 게시글을 생성하는 순수 함수
 * 외부 의존성 없음
 */
export const createPost = (user: string, body: string): Post => ({
  id: crypto.randomUUID(),
  user,
  body,
  createdAt: new Date(),
})

/**
 * 게시글 내용을 수정하는 순수 함수
 */
export const updatePost = (post: Post, newBody: string): Post => ({
  ...post,
  body: newBody,
  modifiedAt: new Date(),
})

