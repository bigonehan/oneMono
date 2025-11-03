// packages/domains/post/PostPort.ts
import { Post } from "./Post"

/**
 * PostPort는 게시글 저장소의 외부 인터페이스(Port)
 * Adapter는 이 인터페이스를 구현하게 된다.
 */
export interface PostPort {
  /**
   * 게시글 생성
   */
  create(post: Post): Promise<void>

  /**
   * 게시글 단일 조회
   */
  getById(id: string): Promise<Post | undefined>

  /**
   * 전체 게시글 목록 조회
   */
  list(): Promise<Post[]>

  /**
   * 게시글 수정
   */
  update(id: string, body: string): Promise<Post | undefined>

  /**
   * 게시글 삭제
   */
  delete(id: string): Promise<void>
}
