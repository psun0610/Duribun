# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 문서 우선순위

이미 문서화된 프로젝트입니다. **구현만 보고 도메인 언어나 규칙을 추론하지 마세요.**

- `AGENTS.md` — AI 에이전트 운영 규칙의 정본 (범위, 변경 규율, 검증, 이슈 처리)
- `docs/product-decisions.md` — 도메인 규칙 (공개 조건, 커플 생명주기, 리뷰 상태 문구, 사진 분류)
- `docs/component-rule.md` / `docs/frontend.md` — 컴포넌트·프론트엔드 코드 규칙
- `docs/design-system.md` + `docs/design-image-files/` — 색/모양/레이아웃과 UI 목업
- `docs/external-providers.md` — Supabase Auth·Kakao 설정
- `docs/prds/duribun-mvp-prd.md`, `issues/` — 계획된 제품 작업
- 저장소: `psun0610/Duribun` (`main` ← PR ← `develop`)

아래 rules 파일은 위 문서에서 **실제 코드와 어긋나거나 강제해야 하는 부분**만 추린 것입니다.

@.claude/rules/workflow.md
@.claude/rules/code-style.md
@.claude/rules/supabase.md
@.claude/rules/testing.md

## 명령

패키지 매니저는 **pnpm**입니다 (`package-lock.json`이 남아 있지만 `pnpm-lock.yaml`이 정본).
`dev`/`build` 스크립트는 앞에 `pnpm i`가 붙어 있습니다.

```bash
pnpm dev          # pnpm i && next dev
pnpm build        # pnpm i && next build
pnpm lint         # eslint .   (경고 2개는 기존부터 있던 것)
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run  (12 파일 / 59 테스트)
```

단일 테스트:

```bash
npx vitest run src/features/share/shareEligibility.test.ts
```

환경변수 검증 — 스크립트 기본값은 `.env.local`이지만 이 저장소의 실제 파일은 `.env`입니다:

```bash
node scripts/validate-env.mjs .env
```

커밋 전에는 `pnpm lint` → `pnpm typecheck` → `pnpm test` 순으로 돌립니다.

`scripts/*.mjs`에는 Playwright로 화면을 캡처하는 수동 확인용 스크립트가 있습니다. 자동화 테스트가 아니라 사람이 눈으로 보려고 만든 것이고, 출력물은 `artifacts/`(gitignore 대상)에 쌓입니다.

## 아키텍처

### 스택

Next.js 16 App Router (React 19, RSC + Server Actions) + Supabase(Postgres/Auth/Storage) + **SCSS Modules**. 상태 라이브러리는 없습니다.

### 라우트 = 탭, 라우트 = 모달

하단 탭과 모달이 전부 **실제 라우트**입니다. 클라이언트 상태로 화면을 전환하지 않습니다.

```
/app                                   → redirect('/app/places')
/app/places · /friends · /explore · /settings    하단 탭 4개
/app/places/new                        장소 등록 패널
/app/places/[couplePlaceId]/review     리뷰 상세 패널
/app/places/[couplePlaceId]/review/new 리뷰 작성 패널
/api/cron/couple-cleanup               만료 커플 정리 (Vercel Cron 전용)
```

패널 라우트는 `src/app/app/places/_components/*RoutePanel.tsx`가 감싸고, 화면 전체는 `CouplePlaceApp` 셸이 유지합니다. 탭을 추가한다면 상태 플래그가 아니라 라우트를 추가하세요.

### `getProtectedAppData()`가 유일한 진입 게이트

[src/app/app/getProtectedAppData.ts](src/app/app/getProtectedAppData.ts)를 `/app/*` 페이지가 전부 호출합니다. 인증·프로필·커플 상태를 순서대로 확인하고 `redirect()`하거나, `kind: 'disconnect-pending'` 또는 정상 데이터 묶음을 돌려줍니다. 커플 장소·친구 추천·탐색 추천·친구 필터가 여기서 한 번에 로드됩니다.

**보호 로직이 두 겹**이라는 점에 주의하세요:

1. `middleware.ts` → `updateSession()` → [src/features/auth/routing.ts](src/features/auth/routing.ts)의 `getAuthGateRedirect()` (보호 경로 목록은 여기 한 곳)
2. `getProtectedAppData()`의 서버 `redirect()`

한쪽만 고치면 흐름이 어긋납니다.

### 데이터 접근은 항상 서버 액션을 거칩니다

```
컴포넌트('use client') → features/<domain>/actions.ts('use server') → Supabase
```

- 컴포넌트에서 Supabase를 직접 호출하지 않습니다. `src/lib/supabase/browser.ts`는 존재하지만 **사용처가 없습니다.**
- 서버 컴포넌트는 `createServerSupabaseClient()`로 읽기만 합니다.
- 폼은 `useActionState(serverAction, initialState)` + `FormData`. 액션은 `{ errorMessage, ... }` 상태 객체를 반환하고 성공 시 `revalidatePath('/app')`.
- `src/lib/supabase/admin.ts`(service_role)는 **RLS를 우회**합니다. 사용자 요청 경로에서 절대 쓰지 마세요. 현재 유일한 사용처는 cron 정리 라우트입니다.

도메인은 `src/features/{auth,couple,friend,place,profile,review,share}` 일곱 개입니다.

### 권한 경계는 앱이 아니라 DB에 있습니다

앱은 **anon key만** 씁니다(cron 제외). 권한 판정은 전부 Postgres에서 일어납니다:

- **RLS 정책** — 읽기 가시성. `reviews` SELECT는 자기 커플 멤버로만 제한되어, 친구라도 남의 한 줄 리뷰를 테이블에서 직접 읽을 수 없습니다.
- **`security definer` RPC** — 여러 행/여러 사용자를 바꾸는 쓰기. `create_couple`, `join_couple_by_invite_code`, `request_couple_disconnect`, `cancel_couple_disconnect`, `regenerate_friend_code`, `create_friendship_by_friend_code`, `register_kakao_couple_place`, `register_manual_couple_place`, `delete_expired_disconnected_couples`
- **뷰** — 커플 밖으로 나가는 데이터는 테이블이 아니라 뷰로만 읽습니다: `friend_couple_place_summaries`, `explore_couple_place_summaries`, `friend_couple_filter_summaries`. 뷰는 security definer라 RLS를 우회하고, 대신 `where` 절의 헬퍼 함수가 게이트 역할을 합니다.
- **헬퍼 함수** — `is_couple_member`, `are_friend_couples`, `is_couple_place_public_ready`, `is_couple_place_explore_ready`. 공개 조건이 바뀌면 정책마다 고치지 말고 헬퍼를 고치세요. 정책·뷰·스토리지 정책이 함께 따라옵니다.

클라이언트 조건문으로 권한을 흉내내지 마세요.

### RPC 에러 → 한국어 문구 매핑

RPC는 영어로 예외를 던지고(`Authentication required`, `Invalid friend code`, ...), 각 `actions.ts`의 `mapXxxErrorMessage()`가 사용자용 한국어 문구로 변환합니다. **새 예외를 RPC에 추가하면 매퍼 분기도 함께 추가**하세요. 안 하면 사용자는 일반 실패 문구만 봅니다.

### 사진과 공개 경계

- 버킷 둘: `review-photos`(비공개 — 서버에서 1시간 signed URL), `profile-avatars`(공개 — `getPublicUrl`)
- 모든 리뷰 사진은 `place_food` 또는 `couple_private`로 분류됩니다. **커플 공간 밖으로 나갈 수 있는 것은 `place_food`뿐**이고, 같은 규칙이 스토리지 RLS에도 박혀 있습니다.
- 새 사진의 기본값은 `DEFAULT_REVIEW_PHOTO_KIND = 'couple_private'`입니다. 기본값은 항상 비공개 쪽이어야 합니다.

### 리뷰 상태

`resolveReviewStatus()`([src/features/review/actions.ts](src/features/review/actions.ts))가 네 상태를 만듭니다. 이름이 헷갈리니 주의하세요:

| 값 | 뜻 |
|---|---|
| `none` | 둘 다 미작성 |
| `waiting-partner` | **내가 썼고** 상대를 기다리는 중 |
| `partner-waiting` | **상대가 썼고** 나를 기다리는 중 |
| `complete` | 둘 다 작성 |

문구는 [src/features/review/const/reviewStatus.const.ts](src/features/review/const/reviewStatus.const.ts) **한 곳에만** 정의합니다. `REVIEW_STATUS_MESSAGE`(스펙 문구)와 `REVIEW_STATUS_BADGE`(카드 뱃지용 짧은 라벨) 두 벌이며, 과거에 이 라벨이 두 파일에 중복 정의돼 서로 다른 값을 갖고 의미까지 뒤집힌 적이 있습니다. 테스트가 네 라벨이 서로 달라야 한다는 것까지 검사합니다.

### 컴포넌트 배치

| 위치 | 무엇 |
|---|---|
| `src/components/ui/` | 디자인 시스템 프리미티브 12종. **배럴 `@/components/ui`로만** import |
| `src/components/` | 도메인 없는 셸 — `AppShell`, `CoupleDisconnectPending`, `HomeIntro` |
| `src/features/<도메인>/components/` | 도메인 화면. 새 컴포넌트는 기본적으로 여기 |

### 스타일 — Tailwind는 죽어 있습니다

`tailwindcss`가 설치돼 있고 `src/app/tailwind.css`도 남아 있지만 **아무도 import하지 않고, JSX에 Tailwind 클래스도 한 개도 없습니다.** 스타일은 전부 SCSS Modules입니다. Tailwind 클래스를 쓰면 조용히 아무 일도 일어나지 않습니다.

토큰 체인: `src/styles/variables.scss`(SCSS 변수) → `src/styles/globals.scss`(`:root` CSS 커스텀 프로퍼티) → 각 컴포넌트의 `*.module.scss`. 컴포넌트에 hex를 직접 쓰지 않습니다.

## 알려진 미완 사항

- **#13 (Slice 12) 미착수.** 그중 가장 눈에 띄는 것: 등록 장소가 0개일 때 [PlacesTabPanel](src/features/place/components/CouplePlaceApp/components/PlacesTabPanel.tsx)이 `MOCK_PLACES`(가짜 장소 4개 + Unsplash 사진)를 진짜 장소처럼 보여줍니다. `EmptyState` 컴포넌트로 교체해야 합니다.
- `createBrowserSupabaseClient`는 정의만 있고 사용처가 없습니다.
- E2E 테스트가 없습니다. 실제 동작 확인은 Supabase에 붙여서 손으로 합니다.
