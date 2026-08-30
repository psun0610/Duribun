# 코드 스타일

정본은 `docs/component-rule.md`와 `docs/frontend.md`입니다. 여기에는 **실제 코드와 문서가 어긋나는 지점**만 적습니다.

## 문서와 실제 코드가 다른 부분

- **세미콜론 없음.** `.prettierrc`가 `semi: false`이고 `src/` 코드도 세미콜론을 쓰지 않습니다. `docs/component-rule.md`의 예제 코드에는 붙어 있지만 따르지 마세요. 예외: `src/types/database.ts`(Supabase 생성물)와 `scripts/*.mjs`.
- **들여쓰기 4칸, 작은따옴표, `printWidth: 80`, `trailingComma: es5`.**
- 라우트 파일(`src/app` 아래 `page.tsx`, `layout.tsx`, `route.ts`)은 `export default`가 필수입니다(Next.js 요구사항). "named export만 사용" 규칙은 그 외 모든 파일에 적용됩니다.
- 컴포넌트 규칙 문서의 import 예시는 `@/shared/components`를 쓰지만 이 저장소에는 `src/shared/`가 없습니다. 공용 프리미티브는 `@/components/ui`입니다.

## 컴포넌트 배치

- 디자인 시스템 프리미티브: `src/components/ui/`. 개별 경로가 아니라 **배럴 `@/components/ui`로** import 합니다.
- 도메인 화면: `src/features/<도메인>/components/<ComponentName>/`. 새 컴포넌트는 기본적으로 여기입니다.
- 도메인 없는 셸만 `src/components/`에 둡니다.

```txt
ComponentName/
├─ ComponentName.tsx        # 렌더링 + 이벤트 바인딩만
├─ ComponentName.module.scss
├─ components/              # 이 컴포넌트에서만 쓰는 하위 조각
├─ types/componentName.types.ts
├─ const/componentName.const.ts   # UPPER_SNAKE_CASE, 사용자 문구 포함
├─ utils/componentName.utils.ts   # 순수 함수, React 의존 금지
├─ hooks/useComponentName.ts
└─ index.ts
```

- `.tsx` 안에 타입·상수·재사용 유틸을 정의하지 않습니다.
- `any` 금지. 불확실하면 `unknown`. `React.FC` 금지. `function` 대신 화살표 함수.
- 불리언은 `is`/`has`/`can`/`should`, 핸들러는 `handle`로 시작.
- 사용자에게 보이는 한국어 문구는 `const/`의 COPY 상수로 모읍니다. JSX에 문자열을 흩뿌리지 마세요 — 테스트가 이 상수를 문자열로 검사합니다.
- **같은 의미의 상수를 두 파일에 정의하지 마세요.** 리뷰 상태 라벨이 실제로 그렇게 갈라져 서로 다른 값이 되고 의미까지 뒤집힌 적이 있습니다. 도메인 문구는 `src/features/<도메인>/const/`에 한 벌만 둡니다.

## 스타일

- **SCSS Modules만 씁니다.** Tailwind는 설치돼 있지만 스타일시트가 어디에도 import되지 않아, Tailwind 클래스를 쓰면 아무 일도 일어나지 않습니다.
- 색/반경/그림자는 `src/styles/variables.scss` 토큰을 거칩니다. 컴포넌트에 hex를 직접 쓰지 않습니다.
- 모바일 퍼스트, iOS Safari 동작을 먼저 고려합니다.
