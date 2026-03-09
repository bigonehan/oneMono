# 문제
- `registerTempStudy`의 Gel upsert 쿼리가 `unless conflict` 문맥에서 잘못 작성돼 `cannot reference correlated set` 오류를 발생시켰다.
- `git switch main` 실행 시 로컬 수정된 `todo.md`가 브랜치 전환을 막았다.

# 미해결점
- temp-study 저장/재저장 테스트가 실패했다.
- 현재 병합 작업은 `todo.md` 작업본을 임시 보관하거나 원복하지 않으면 진행할 수 없다.
