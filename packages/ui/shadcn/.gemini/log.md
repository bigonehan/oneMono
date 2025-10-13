# Component Reference Fix Log

## Summary
`components` 폴더 내의 여러 컴포넌트에서 `components/ui`의 컴포넌트를 잘못 참조하는 문제를 발견하고 수정했습니다. 주요 원인은 `components/ui`의 기본 컴포넌트들이 오래되었거나 수정되어 `React.forwardRef`나 props interface export가 누락되었기 때문입니다.

## Actions Taken
1.  **Analysis**: `LoginButton.tsx`가 `ui/button.tsx`에서 export하지 않는 `ButtonProps`를 import하려는 문제를 확인했습니다. 추가 분석을 통해 `dialog`, `avatar`, `badge`, `input`, `label`, `sheet`, `switch` 등 다른 UI 컴포넌트에서도 유사한 문제가 있음을 발견했습니다.
2.  **Correction using shadcn-ui**: 문제를 수동으로 수정하는 대신, 프로젝트의 표준인 `shadcn-ui` CLI를 사용하여 영향을 받는 모든 UI 컴포넌트를 재설치하여 최신 버전으로 업데이트했습니다. 이 방법으로 일관성을 유지하고 모든 컴포넌트가 올바른 `ref` 전달 및 props export를 갖도록 했습니다.
    - 재설치된 컴포넌트: `button`, `dialog`, `avatar`, `badge`, `input`, `label`, `sheet`, `switch`, `card`, `alert`, `sonner`.
3.  **Path Correction**: `shadcn-ui` CLI가 중첩된 `components/components/ui` 경로에 파일을 생성하는 문제를 `mv` 명령어로 파일을 올바른 위치로 이동시켜 해결했습니다.
4.  **User Note**: 사용자의 요청에 따라 `React.forwardRef`에 대한 노트를 `gemini.md`에 추가했습니다.

## Final Fixes
After re-installing the base UI components, a `type-check` revealed remaining issues:
1.  **`ButtonProps` not exported**: The re-installed `ui/button` component still did not export `ButtonProps`. This caused errors in all custom button components.
2.  **`toast` import error**: `ToastWindow.tsx` was trying to import the `toast` function from `ui/sonner`, which only exports the `Toaster` component.

**Resolution:**
1.  A new type definition file was created at `types/button.ts` to define and export `ButtonProps`.
2.  All components in `components/button/` were updated to import `ButtonProps` from this new file.
3.  The import statement in `ToastWindow.tsx` was corrected to import `toast` directly from the `sonner` library.

## Result
`components/ui`의 모든 컴포넌트가 이제 표준에 맞게 업데이트되었고, 나머지 타입 오류들도 모두 수정되었습니다. `pnpm run type-check` 명령어가 성공적으로 완료되어 프로젝트의 타입 안정성이 확보되었음을 확인했습니다.