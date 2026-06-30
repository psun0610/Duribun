# Duribun MVP PRD

## Problem Statement

Couples need a private way to remember and evaluate date places together. Existing public review services are optimized for individual, public reviews, so they do not support the couple-specific workflow of both partners leaving private impressions, waiting for the other partner's review, and then selectively sharing only safe parts of the experience.

Duribun should let a couple build a shared place list, review each place privately, and selectively share polished recommendations with friend couples or the broader discovery surface without leaking one-line reviews, private couple photos, or individual rating metrics.

## Solution

Build a Next.js, TypeScript, and Supabase application for private couple place reviews.

Users sign in with social auth, create a personal profile, and either create a couple invite code or join an existing couple by entering a code. Once connected, the couple can register global places through Kakao Local search or manual entry, categorize them as restaurant, cafe, or activity, and each partner can leave their own category-specific rating metrics, tags, one-line review, and required photos.

The app shows review progress copy based on whether neither, one, or both partners have reviewed the place. A couple place becomes shareable only after both partners have reviewed it and at least one place/food photo exists. Public surfaces expose only place name, category, average representative rating, tags, and place/food photos. One-line reviews, private couple photos, and individual rating metrics remain visible only inside the active couple space.

Couples can add friend couples by copying and entering friend codes. Friend recommendations show public-ready places from friend couples, with per-user toggles for which friend couples to include. Explore shows public-ready places from all users, with manual places excluded until approved or matched to Kakao.

Couple disconnect is intentionally strict: either partner can request disconnect, the couple space immediately locks, any partner can cancel within 7 days, and after 7 days the couple data is deleted.

## User Stories

1. As a new user, I want to sign in with Kakao, so that I can start the app quickly with a familiar account.
2. As a new user, I want to sign in with Naver, so that I can use the account I already use most often.
3. As a new user, I want to sign in with Google, so that I can use a broadly supported login method.
4. As a developer or tester, I want email auth available in non-production or controlled contexts, so that I can test account flows without relying on social providers.
5. As a signed-in user, I want to create my personal profile, so that my account has a display name and optional avatar.
6. As a user without a couple, I want to create a couple invite code, so that I can share it with my partner.
7. As a user without a couple, I want to enter my partner's couple invite code, so that we become connected as a couple.
8. As a user, I want couple invite codes and friend codes to be separate, so that I do not accidentally grant the wrong kind of access.
9. As a connected partner, I want to see our couple space, so that we can manage our shared date places.
10. As a connected partner, I want the couple space to be locked during disconnect pending, so that no one continues using a relationship space that is being closed.
11. As a connected partner, I want to request couple disconnect by myself, so that I can start the separation process without needing approval.
12. As either partner, I want to cancel disconnect within 7 days, so that accidental or regretted disconnect requests can be restored.
13. As either partner, I want couple data deleted after the 7-day grace period, so that the old relationship data does not remain indefinitely.
14. As a connected partner, I want to search Kakao places by keyword, so that I can register real places with accurate metadata.
15. As a connected partner, I want to create a manual place when search does not find it, so that unusual or new places can still be reviewed.
16. As a connected partner, I want each place categorized as restaurant, cafe, or activity, so that our place list and recommendations are easy to browse.
17. As a connected partner, I want places to be global records, so that the same physical place can aggregate recommendations across couples.
18. As a connected partner, I want our couple-specific state stored separately from the global place, so that our private review data remains ours.
19. As a connected partner, I want to register a place before reviewing it, so that we can track places that need a review.
20. As a connected partner, I want to see `이 장소는 어땠나요?` when neither partner reviewed a place, so that the next action is clear.
21. As a connected partner, I want to see `상대를 기다리는 중...` when only I reviewed a place, so that I know the review is incomplete.
22. As a connected partner, I want to see `상대가 기다리고 있어요` when only my partner reviewed a place, so that I know I should review it.
23. As a connected partner, I want to submit my own category-specific rating metrics for a place, so that my opinion is preserved independently.
24. As a connected partner, I want my partner to submit their own rating metrics, so that our public rating can represent both of us.
25. As a connected partner, I want the app to average each review's representative rating for public surfaces, so that friends and explorers see a couple-level signal without exposing private metric details.
26. As a connected partner, I want to write a one-line review, so that our couple can remember the personal context privately.
27. As a connected partner, I want one-line reviews to remain private, so that intimate or subjective comments are not exposed.
28. As a connected partner, I want to select category-specific tags, so that reviews are easy to scan and aggregate.
29. As a connected partner, I want optional custom tag support, so that we can capture a nuance not covered by the preset tags.
30. As a connected partner, I want at least one photo required when writing a review, so that shared recommendations include useful visual context.
31. As a connected partner, I want to classify each photo as place/food or couple/private, so that sharing rules are explicit at upload time.
32. As a connected partner, I want place/food photos to be shareable, so that friends and explorers can inspect the place.
33. As a connected partner, I want couple/private photos to remain inside our couple space, so that personal photos do not leak.
34. As a connected partner, I want to mark each couple place public or private, so that we control which places are shared.
35. As a connected partner, I want a place to be public only after both reviews are complete, so that incomplete opinions are not shown as couple recommendations.
36. As a connected partner, I want a place to be public only when it has at least one place/food photo, so that shared entries are visually useful.
37. As a connected partner, I want private places hidden from friends and explore, so that our personal date history stays private by default.
38. As a connected partner, I want to copy our friend code, so that we can add trusted friend couples.
39. As a connected partner, I want to regenerate our friend code, so that leaked codes can be invalidated.
40. As a connected partner, I want regenerating a friend code to keep existing friends, so that code rotation does not break current relationships.
41. As a connected partner, I want to enter another couple's friend code, so that we become friend couples immediately.
42. As a connected partner, I want friend registration to require a code, so that random discovery cannot create friendships.
43. As a connected partner, I want friend registration to require no approval after code entry, so that sharing a code is the approval.
44. As a connected partner, I want friend relationships to be couple-to-couple, so that recommendations reflect couples rather than individual accounts.
45. As a connected partner, I want to see friend couple names in the friend recommendations tab, so that I know whose recommendation I am seeing.
46. As a connected partner, I want to toggle specific friend couples on or off, so that I can focus on the couples I am curious about right now.
47. As a connected partner, I want friend couple toggles saved per user, so that my filter choices do not affect my partner.
48. As a connected partner, I want friend recommendations to show only public-ready places, so that private or incomplete reviews are not exposed.
49. As a connected partner, I want explore to show public-ready places from all users, so that I can discover good date places beyond my friends.
50. As a connected partner, I want explore to support recommendation, rating, and newest sorting, so that I can browse based on different needs.
51. As a connected partner, I want explore to support category and region filtering, so that I can find relevant date places faster.
52. As a connected partner, I want manual places excluded from explore until approved or matched, so that public discovery stays clean.
53. As a connected partner, I want manual places allowed in friend recommendations, so that trusted friends can still see niche or newly opened places.
54. As an explorer, I want public recommendations to hide individual rating metrics, so that I see a couple-level average without private detail.
55. As an explorer, I want public recommendations to hide one-line reviews, so that personal couple context remains private.
56. As an explorer, I want public recommendations to hide couple/private photos, so that private images never leave the couple space.
57. As a system, I want sharing eligibility enforced by database rules, so that frontend mistakes do not leak private data.
58. As a system, I want couple-space access blocked for inactive couples, so that disconnect pending couples do not keep exposing data.
59. As a system, I want expired disconnect requests cleaned up, so that pending data is deleted after the 7-day window.
60. As a system, I want uploaded photo access governed by the same visibility model as review data, so that storage objects cannot be fetched outside policy.

## Implementation Decisions

- Build the app with Next.js, TypeScript, Supabase Auth, Supabase Postgres, Supabase Storage, and Kakao Local API.
- Use Supabase Auth social providers for Kakao, Naver, and Google. Keep email auth available for development and controlled testing.
- Model places globally and couple-specific place state separately.
- Store reviews per individual partner. Each review has extensible category-specific rating metrics and a representative rating calculated from those metrics. Public surfaces use the average of partner representative ratings, not individual metric details.
- Treat a couple place as public-ready only when the couple is active, the place is marked public, both partners have reviewed it, and at least one place/food photo exists.
- Treat a couple place as explore-ready only when it is public-ready and either Kakao-backed or approved after manual creation.
- Keep one-line reviews, private couple photos, and individual rating metrics inside the active couple space.
- Model rating metrics as keyed rows so restaurant, cafe, and activity metric definitions can change without adding new rating columns.
- Require every review to include at least one photo.
- Require every photo to be classified as place/food or couple/private.
- Use category-specific selectable tags, with optional custom tag support at the application layer.
- Use Kakao Local keyword search as the primary place registration path. Persist provider, provider place id, place name, category hint, address, road address, coordinates, and place URL.
- Allow manual place registration as a fallback. Manual places can appear in friend recommendations but require approval or Kakao matching before explore.
- Implement couple creation and couple joining as server-side RPC operations so invite-code workflows are atomic and constrained.
- Implement friend-code registration and friend-code regeneration as server-side RPC operations so friendships are created consistently and codes can be rotated.
- Represent friendships as couple-to-couple relationships. Code entry immediately creates the friendship without a separate approval step.
- Save friend couple filter toggles per user, not per couple, so partners can personalize the friend recommendation tab independently.
- Implement couple disconnect as a state transition: active to disconnect pending. Disconnect pending locks the couple space and stops friend/explore exposure.
- Allow either partner to cancel disconnect within 7 days. After 7 days, a service-role cleanup job deletes expired disconnect pending couples and cascades couple data.
- Use deep modules around auth/session bootstrapping, couple membership lifecycle, place registration, review completion and sharing eligibility, friend relationships, recommendation queries, photo storage, and disconnect lifecycle.
- Keep sharing eligibility centralized in database functions and mirrored in typed application helpers only for UI state display.
- Expose separate read models for friend recommendations and explore recommendations so the two visibility rules cannot be accidentally conflated.
- Keep administrative explore approval for manual places outside the user-facing MVP interface unless needed for launch operations.

## Testing Decisions

- Tests should assert external behavior and permission boundaries, not implementation details.
- Database tests should verify RLS and RPC behavior for private data, public-ready data, friend-visible data, explore-visible data, and disconnect pending data.
- Couple lifecycle tests should cover create couple, join by invite code, duplicate membership rejection, full couple rejection, disconnect request, disconnect cancellation, and expired disconnect deletion.
- Friend relationship tests should cover friend-code registration, self-friend rejection, duplicate friendship idempotency, friend-code regeneration, and per-user friend filter toggles.
- Review workflow tests should cover the four review status states, individual rating metric persistence, representative rating calculation, average public rating, required photos, and public eligibility.
- Photo visibility tests should cover place/food versus couple/private access for own couple, friend couple, explore user, and unrelated user.
- Place registration tests should cover Kakao-backed places, manual places, duplicate provider place ids, and manual explore approval.
- Recommendation tests should cover friend recommendation filtering, explore eligibility, category filtering, region filtering, recommendation sort, rating sort, and newest sort.
- Application tests should cover onboarding flows, code entry errors, review form validation, photo type selection, share toggle behavior, friend tab toggles, and locked disconnect-pending state.
- Good tests should create realistic users, couples, places, reviews, friendships, and photos, then assert what each actor can see or mutate from the public interface.
- Because the codebase is currently at schema/prototype stage, there is no existing local test prior art to reuse yet. Establish Supabase database tests and Next.js component/flow tests as the first testing patterns.

## Out of Scope

- Visit-history or multiple reviews per place per couple.
- Comments, reactions, or messaging between couples.
- Photo editing, cropping, filters, albums, or advanced media management.
- Public written reviews.
- Approval flow for friend requests.
- Friend discovery without explicit friend codes.
- Partner replacement inside an existing couple.
- Keeping old couple data after the 7-day disconnect deletion period.
- Native mobile apps.
- Offline mode.
- Push notifications, except future reminders or lifecycle alerts.
- Advanced personalization or machine-learning recommendations.
- Admin dashboard beyond the minimal capability needed to approve or match manual places for explore.

## Further Notes

- The product should bias toward privacy by default. Public and friend-facing surfaces must never rely only on frontend filtering.
- The Korean review status copy is product-critical and should be treated as part of the domain language.
- Friend recommendation and explore are intentionally different surfaces: friend recommendation can include manual places from trusted friend couples, while explore needs higher data quality.
- The current repository contains an initial Supabase schema and product decisions document, but no full Next.js application scaffold yet.
