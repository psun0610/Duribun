# AI Usage Guidelines

## Commit Messages

항상 커밋 메시지는 한국어로 작성합니다.
All AI-generated commits must use one of the following prefixes:

- `[Init]` for project setup, initial schema, baseline docs, or first-time scaffolding.
- `[Feat]` for new user-facing features or product capabilities.
- `[Fix]` for bug fixes.
- `[Hotfix]` for urgent production fixes.
- `[Chore]` for maintenance, dependency, tooling, formatting, or non-feature changes.
- `[Perf]` for performance improvements.

Format:

```text
[Init] 제품 결정 및 초기 Supabase 스키마를 추가합니다.
[Feat] 커플 초대 온보딩 추가합니다.
[Fix] 올바른 리뷰 공개 정책으로 수정합니다.
```

제목을 작성했다면 아래에는 상세 작업 내역을 작성합니다.

Examples:

```text
[Feat] 필수 사진이 있는 리뷰 작성기를 추가합니다

### 상세 작업 내용
  - 커플 장소에 리뷰를 작성하는 리뷰 작성기를 추가했습니다.
  - 평점, 한 줄 리뷰, 카테고리 태그, 사진 1장 이상을 받도록 했습니다.
  - 각 사진마다 장소/음식 또는 커플/비공개 유형을 선택하게 했습니다.
  - 사진은 최대 5장까지 추가할 수 있습니다.
  - 리뷰는 couple_place_id + author_id 기준으로 저장되어, 본인 리뷰만 수정되도록 처리했습니다.
  - 리뷰 작성기와 다중 사진 업로드 흐름에 대한 테스트를 추가했습니다.
```
