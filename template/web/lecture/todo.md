# problem
draft 생성 단계가 반복 hang되어 신규 draft 작성이 막힌 상태에서 구현/검증 완료가 지연된다.

# tasks
- 기존 `.project/drafts.yaml` 산출물을 기준으로 `orc impl_code_draft`를 실행한다.
- 이후 `orc clit test -p . -m "lecture site workflow check"`, `orc check_code_draft -a`, `npm run build`를 실행한다.
- 실제 코드와 설계 문서 간 누락 항목을 점검해 최소 보완 상태를 최종 정리한다.
- 완료 시 `.agents/log.md` 기록과 `nf -m` 완료 알림을 실행한다.
- 강제 실행 항목: 다음 시도는 `orc impl_code_draft`를 반드시 실행한다.

# check
- `orc impl_code_draft`
- `orc clit test -p . -m "lecture site workflow check"`
- `orc check_code_draft -a`
- `npm run build`
