/**
 * 커서를 문자열로 인코딩/디코딩하는 순수 유틸.
 * Relay 사양에 맞춰 base64로 처리한다.
 */

/**
 * index(예: 0, 1, 2...) → base64("cursor:{index}")
 */
export const toCursor = (index: number): string => {
  return Buffer.from(`cursor:${index}`).toString("base64")
}

/**
 * base64("cursor:{index}") → index number
 */
export const fromCursor = (cursor: string): number => {
  const decoded = Buffer.from(cursor, "base64").toString("utf8")
  const [, indexStr] = decoded.split(":")
  return parseInt(indexStr, 10)
}

