# current capture
- URL: `http://127.0.0.1:3000`
- screenshot: `/home/tree/home-check-ui-template-web/template/web/donation/rc-web.png`
- supporting captures:
  - `/home/tree/home-check-ui-template-web/template/web/donation/screen-capture.png`
  - `/home/tree/home-check-ui-template-web/template/web/donation/rect-capture.png`
- current UI summary:
  - warm color palette and donation stats exist, but the page reads as a stack of same-weight cards rather than a guided donation narrative.
  - first fold explains the campaign, yet the donation action is deferred below the fold and the hero has no immediate preset/CTA rail.
  - section boundaries are technically separate, but the story, proof, impact, and checkout blocks do not feel intentionally grouped.

# reference captures
- charity: water
  - URL: `https://www.charitywater.org/`
  - screenshot: `/home/tree/home-check-ui-template-web/template/web/donation/.captures/check-ui/charity-water-home.png`
  - qualities to borrow:
    - hero combines emotional media with an immediate giving control
    - recurring/one-time choice and preset amounts appear before scrolling
    - CTA contrast is sharper than the surrounding content
- ShareTheMeal
  - URL: `https://sharethemeal.org/en-us/`
  - screenshot: `/home/tree/home-check-ui-template-web/template/web/donation/.captures/check-ui/sharethemeal-home.png`
  - qualities to borrow:
    - hero transitions into clearly named action sections instead of a flat card stack
    - modular campaign blocks make the page easy to scan
    - whitespace and larger media create stronger rhythm between sections
- GiveWell
  - URL: `https://www.givewell.org/`
  - screenshot: `/home/tree/home-check-ui-template-web/template/web/donation/.captures/check-ui/givewell-home.png`
  - qualities to borrow:
    - research/proof statements sit immediately below the hero and reinforce trust
    - sections alternate between large imagery, proof, and metrics
    - hierarchy is clear because headings, proof points, and action areas have distinct weights

# missing functionality
- add an above-the-fold quick donate rail so users can select a preset or jump to checkout without hunting for the action section.
- add section-level navigation or labeled progress markers so the landing reads as a guided sequence: mission -> proof -> impact -> donate.
- add a proof/update area that shows why the campaign is credible now, not just what it is.
- add at least one focused social-proof or organizer update block so the page has a trust anchor between the story and checkout.

# missing design
- the hero, intro, detail, impact, and checkout panels share nearly identical surface treatment, which flattens hierarchy and makes section transitions feel accidental.
- the first fold is text-heavy and stat-heavy but not action-heavy; the eye lands on numbers before it finds a clear donate path.
- story content is split into two equal cards with weak visual contrast, so the page does not create a strong narrative cadence.
- impact cards and checkout area feel disconnected from the hero because they reuse the same dark panel language without new visual emphasis.
- the page lacks a dominant visual asset or sectional background shifts, so the campaign feels more like a dashboard than a public donation experience.

# implementation order
1. Rebuild the first fold so the hero copy, trust proof, and quick donation action are visibly grouped.
2. Reorganize the landing into clearer sections with distinct visual roles: mission/story, proof/update, impact ladder, checkout.
3. Add missing trust/support modules that improve credibility and make section transitions intentional.
4. Refresh typography, spacing, and section backgrounds so each block has a clear reason to exist.
5. Rerun lint, typecheck, build, and ORC capture verification and update `./job.md`.

# dispatch prompt
`cd /home/tree/home-check-ui-template-web/template/web/donation && codex exec --dangerously-bypass-approvals-and-sandbox "$orc-cli-workflow ./plan.md를 읽고 donation landing의 UI 부족 기능과 디자인 부족 항목을 구현하라. 시작 전에 todo.md와 ./job.md를 현재 실패 원인 기준으로 정리하고, hero quick donate rail, section 재구성, proof/update block, trust/impact 시각 위계를 순서대로 반영하라. 구현 후 bun run lint, bun run check-types, bun run build, orc clit test -p . -m 'donation ui improvement verification'를 다시 실행하고 ./job.md의 # 문제를 0으로 만든 뒤 결과를 정리하라."`
