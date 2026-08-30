# Supabase 규칙

## 마이그레이션

- 스키마 변경은 항상 `supabase/migrations/`에 **새 파일**을 추가합니다. 기존 마이그레이션 파일은 수정하지도, 이름을 바꾸지도 않습니다 — 테스트가 파일 경로를 하드코딩해서 읽습니다.
- 파일명은 기존 패턴 `YYYYMMDDHHMMSS_snake_case_description.sql`을 따릅니다.
- 함수와 뷰는 `create or replace`로 작성해 재적용 가능하게 유지합니다.
- 원격 적용은 `supabase db push`. 뷰를 `create or replace`로 바꿀 때 **컬럼 순서를 바꾸면 push가 실패**합니다(실제로 한 번 막혔습니다). 컬럼을 추가할 때는 뒤에 붙이세요.

## 권한은 DB에서 강제합니다

- **읽기 가시성**은 RLS 정책으로. 앱 코드에서 필터로 흉내내지 않습니다.
- **여러 행/여러 사용자를 바꾸는 쓰기**는 `security definer` RPC로. 단순한 본인 소유 데이터 쓰기(프로필 upsert, 본인 리뷰 upsert, 공개 토글)는 RLS 아래 직접 테이블 접근으로 처리합니다.
- **커플 밖으로 나가는 데이터는 뷰로만** 읽습니다(`friend_couple_place_summaries`, `explore_couple_place_summaries`, `friend_couple_filter_summaries`). 뷰는 security definer라 RLS를 우회하므로, `where` 절의 헬퍼 함수가 유일한 게이트입니다. 뷰에 컬럼을 추가하는 것은 곧 공개 필드를 늘리는 것이니 `docs/product-decisions.md`의 공개 필드 목록과 대조하세요.
- 공개/탐색 조건은 헬퍼 함수(`is_couple_place_public_ready`, `is_couple_place_explore_ready`, `couple_place_has_public_photo`, `are_friend_couples`)에 모여 있습니다. 조건이 바뀌면 정책마다 고치지 말고 헬퍼를 고치세요.
- 새 RPC를 추가하면 `grant execute`도 함께 부여해야 합니다 (`20260610002000_grant_couple_rpc_execute.sql` 참고 — 빠뜨린 적이 있습니다).
- **RPC를 만들었다면 호출하는 코드까지 같이 만드세요.** `delete_expired_disconnected_couples`는 오랫동안 정의와 grant만 있고 호출부가 없어서, 문서상 "7일 후 삭제"가 실제로는 한 번도 실행되지 않았습니다. 지금은 `/api/cron/couple-cleanup`이 호출합니다.

## service_role

`src/lib/supabase/admin.ts`는 RLS를 우회합니다. **사용자 요청 경로에서 절대 쓰지 마세요.** 현재 유일한 사용처는 `CRON_SECRET`으로 보호된 cron 라우트입니다. 새 관리자 작업이 필요하면 같은 방식(비밀값 게이트 + service_role 전용 RPC)을 따르세요.

## 스토리지

- `review-photos`는 **비공개** 버킷입니다. 서버에서 `createSignedUrl(path, 60 * 60)`로 노출합니다.
- `profile-avatars`는 공개 버킷이며 `getPublicUrl`을 씁니다.
- 두 버킷 모두 `(storage.foldername(name))[1] = auth.uid()::text` 규칙으로 자기 폴더에만 씁니다.
- 리뷰 사진 가시성은 `review_photos.kind`를 따릅니다. **`place_food`만 커플 공간 밖으로 나갈 수 있습니다.** 스토리지 정책에도 같은 조건이 들어 있으니 앱에서 노출 조건을 바꾼다면 스토리지 정책도 같이 봐야 합니다. 새 사진의 기본 유형은 항상 비공개 쪽(`couple_private`)입니다.

## 타입

`src/types/database.ts`는 Supabase 생성 파일입니다. 손으로 고치지 말고 마이그레이션 적용 후 재생성하세요:

```bash
npx supabase gen types typescript --linked > src/types/database.ts
```

새 테이블·뷰·RPC를 추가하고 타입을 재생성하지 않으면 `supabase.rpc('...')` 호출이 타입 에러가 납니다.

## 에러 메시지

RPC는 영어로 예외를 던지고, `src/features/<domain>/actions.ts`의 `mapXxxErrorMessage()`가 한국어 사용자 문구로 변환합니다. **새 예외를 추가하면 매퍼 분기도 추가**하세요.
