# problem
- 사용자가 지적한 `template/web` 범위를 단일 템플릿으로 축소하면 안 된다.
- 현재 `landing`은 hello panel 수준의 단일 카드라 section 구조가 없고, `astro`는 placeholder section 나열이라 실제 정보 위계가 없다.
- `template/web` 전체를 읽은 뒤, section 정리 문제가 가장 직접적인 두 템플릿을 먼저 개선하고 검증해야 한다.
- `template/web/landing`의 기존 lint 설정은 `eslint@10`과 `eslint-config-next` 조합 문제로 `react/display-name` 로딩 단계에서 실패한다.

# tasks
- `template/web` 하위 템플릿 목록과 엔트리 파일을 먼저 점검해 범위 축소 없이 현재 상태를 기록한다.
- `template/web/landing`을 hero + section 흐름이 있는 실제 랜딩 템플릿으로 재구성한다.
- `template/web/astro`의 placeholder section 나열을 정보 위계가 있는 hero/table/workflow/section 구조로 재구성한다.
- `template/web/landing`의 lint 실패 원인을 해결하기 위해 ESLint 버전을 Next 템플릿과 호환되는 범위로 조정하고 설치를 갱신한다.
- 각 템플릿별 빌드 또는 타입/린트 검증을 실행하고, section 정리 개선이 실제 렌더에 반영되는지 확인한다.

# check
- `bun install`
- `npm --prefix template/web/landing run lint`
- `npm --prefix template/web/landing run build`
- `bun --cwd template/web/astro run check-types`
- `bun --cwd template/web/astro run build`
- `rg -n "section|hero|workflow|table|panel|card" template/web/landing template/web/astro`
