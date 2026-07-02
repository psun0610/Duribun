# Duribun Product Decisions

## Scope

Duribun is a private couple place review app with selective sharing to friend couples and public discovery.

## Core Model

- Places are global records.
- Couple-specific place state is stored separately from the global place.
- Reviews are individual: each partner writes their own category-specific rating metrics, tags, one-line review, and photos.
- Each review stores a representative rating calculated from its current rating metrics.
- Public rating is the average of the partners' representative review ratings.
- Rating metric definitions are category-specific and expected to change over time, so they must be modeled as extensible keyed metrics rather than hard-coded DB columns.

## Review Status Copy

For a couple place:

- Neither partner reviewed: `이 장소는 어땠나요?`
- Only current user reviewed: `상대를 기다리는 중...`
- Only partner reviewed: `상대가 기다리고 있어요`
- Both reviewed: show completed review state.

## Sharing Rules

Each couple place can be public or private.

Publicly visible fields:

- Place name
- Category
- Average rating
- Tags
- Place/food photos

Private fields:

- One-line reviews
- Couple/private photos
- Individual rating metrics

Public eligibility requires:

- Couple place is marked public.
- Both partners completed reviews.
- At least one `place_food` photo exists.
- The couple is active.

Explore eligibility additionally requires:

- Kakao-matched place, or
- Manually created place approved for explore.

## Photos

- A review requires at least one photo.
- Every photo must be classified as either `place_food` or `couple_private`.
- Only `place_food` photos can appear outside the couple space.

## Tags

Tags are category-specific selectable tags, with optional custom tag support at the app layer.

Initial tag examples:

- Restaurant: `맛있어요`, `가성비 좋아요`, `분위기 좋아요`, `예약 추천`, `웨이팅 있음`, `기념일 추천`
- Cafe: `커피 맛집`, `디저트 맛집`, `조용해요`, `사진 잘 나와요`, `작업 가능`, `뷰 좋아요`
- Activity: `재밌어요`, `초보 가능`, `실내`, `야외`, `비 오는 날 추천`, `예약 필요`
- Common: `재방문 의사 있음`, `대화하기 좋아요`, `데이트 코스 추천`

## Rating Metrics

Reviews use multiple category-specific rating metrics. The current initial metric set is:

- Restaurant: taste, cleanliness, value, satisfaction
- Cafe: coffee, dessert, mood, seat comfort, satisfaction
- Activity: fun, accessibility, value, satisfaction

Each metric is scored from 0.5 to 5.0 in 0.5 increments. A review's representative rating is the average of its metric scores rounded to one decimal place. Public and friend-facing surfaces expose only the couple-level average representative rating, not the individual metric breakdown.

## Couple Lifecycle

- A user can create a couple invite code when not connected.
- Another user can join by entering that invite code.
- Couple invite code and friend code are separate.
- Couple disconnect can be requested by either partner.
- On disconnect request, the couple space is immediately locked.
- Any partner can cancel within 7 days to restore access.
- After 7 days, couple data is deleted.
- During disconnect pending, friend and explore exposure stops.

## Friends

- Friend relationship is couple-to-couple.
- Each couple has a friend code.
- Entering another couple's friend code immediately creates the friendship.
- No approval flow is required.
- Friend code can be regenerated.
- Regenerating friend code does not remove existing friendships.
- Friend recommendation tab shows friend couple names.
- Friend couple filter toggles are saved per individual user.

## Place Registration

- Primary registration uses Kakao Local keyword search.
- Store Kakao place id, name, category hint, address, road address, coordinates, and place URL.
- Manual place creation is allowed.
- Manual places can appear in friend recommendations.
- Manual places require review/approval or Kakao matching before appearing in explore.

## Auth

Use Supabase Auth with Kakao, Naver, and Google providers. Email auth can remain enabled for development and testing.
Kakao auth requests `account_email`; when Kakao returns an email, use it as the app profile email and disable editing in the profile setup form. Other social auth providers do not use provider email as the app profile email. After social sign-in, the profile setup form asks for email directly while pre-filling nickname and avatar when the provider returns them.
The login page must validate the current session before rendering. If the user already has a valid session, route them to the requested `next` path when present, otherwise continue into profile setup. If the refresh token is stale or expired, clear the stale auth cookies and keep the user on the login screen so they can sign in again. OAuth and email login flows must preserve `next` through the callback so users return to the destination they originally requested.
