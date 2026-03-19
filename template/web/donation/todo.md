# problem
- `template/web/donation`은 hero, story, impact, checkout section이 같은 무게로 쌓여 first-fold CTA와 section 구분이 약했다.
- `$check-ui` 흐름으로 current/reference capture를 남기고, quick donate rail과 proof/update 구조를 실제 화면에 반영해야 했다.
- UI 변경 후에는 `admin PUT -> saveCampaignContent -> data file -> landing rerender` 연결이 계속 살아 있는지 런타임으로 검증해야 한다.

# tasks
- workspace 의존성을 복구하고 ORC current capture, reference capture, `plan.md` 작성까지 완료한다.
- `app/page.tsx`와 `app/globals.css`를 중심으로 hero CTA, section rhythm, proof/update blocks, checkout hierarchy를 재구성한다.
- lint/typecheck/build, dev 서버, admin 저장 경로, ORC capture를 다시 실행하고 결과를 `.project/feedback.md`에 정리한다.

# check
- `cd /home/tree/home-check-ui-template-web && bun install`
- `cd /home/tree/home-check-ui-template-web/template/web/donation && test -x node_modules/.bin/next`
- `cd /home/tree/home-check-ui-template-web/template/web/donation && orc clit test -p . -m "ui audit capture"`
- `cd /home/tree/home-check-ui-template-web/template/web/donation && bun run lint`
- `cd /home/tree/home-check-ui-template-web/template/web/donation && bun run check-types`
- `cd /home/tree/home-check-ui-template-web/template/web/donation && bun run build`
- `cd /home/tree/home-check-ui-template-web/template/web/donation && bun run dev`
- `curl http://127.0.0.1:3000`
- `curl -X PUT http://127.0.0.1:3000/api/admin/content -H 'Content-Type: application/json' --data @/tmp/donation-test-payload.json`
- `rg -n "DonationForm|handleSubmit|/api/donate|saveCampaignContent|loadCampaignContent|loadDonationState" /home/tree/home-check-ui-template-web/template/web/donation/app /home/tree/home-check-ui-template-web/template/web/donation/components /home/tree/home-check-ui-template-web/template/web/donation/lib`
- `cd /home/tree/home-check-ui-template-web/template/web/donation && orc clit test -p . -m "donation ui improvement verification"`
