# 문제
- `registerTempStudy`의 Gel upsert 쿼리가 `unless conflict` 문맥에서 잘못 작성돼 `cannot reference correlated set` 오류를 발생시켰다.

# 미해결점
- temp-study 저장/재저장 테스트가 실패했다.
