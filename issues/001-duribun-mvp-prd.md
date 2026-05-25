---
title: "PRD: Duribun MVP"
labels:
  - ready-for-agent
type: prd
status: open
---

# PRD: Duribun MVP

## Problem Statement

Couples need a private way to remember and evaluate date places together. Existing public review services are optimized for individual, public reviews, so they do not support the couple-specific workflow of both partners leaving private impressions, waiting for the other partner's review, and then selectively sharing only safe parts of the experience.

## Solution

Build a Next.js, TypeScript, and Supabase application for private couple place reviews with selective sharing to friend couples and public exploration.

The MVP includes social auth, personal profiles, couple invite codes, Kakao place search, manual place creation, private couple reviews, required photo uploads, per-place sharing, friend-code friendships, friend couple filters, public explore, and 7-day couple disconnect deletion.

## Acceptance Criteria

- Users can authenticate with Kakao, Naver, and Google.
- Users can create a profile.
- Users without a couple can create a couple invite code.
- Users without a couple can join a couple by entering an invite code.
- Couple invite codes and friend codes are separate.
- Couples can register places through Kakao Local search.
- Couples can manually register places when search does not find them.
- Places use the categories restaurant, cafe, and activity.
- Each partner can write one review per couple place.
- Reviews require rating, tags, one-line review, and at least one photo.
- Every photo is classified as place/food or couple/private.
- The UI shows the correct review status copy for neither, self-only, partner-only, and completed review states.
- A couple place can be marked public or private.
- A couple place is public-ready only when both reviews are complete and at least one place/food photo exists.
- Public surfaces expose only place name, category, average rating, tags, and place/food photos.
- One-line reviews, individual ratings, and couple/private photos remain private.
- Couples can copy and regenerate their friend code.
- Entering another couple's friend code creates a couple-to-couple friendship immediately.
- Friend recommendation shows public-ready places from friend couples.
- Friend recommendation shows friend couple names.
- Friend couple filter toggles are stored per individual user.
- Explore shows public-ready places from all users.
- Manual places require approval or Kakao matching before explore.
- Either partner can request couple disconnect.
- Disconnect pending immediately locks the couple space and stops friend/explore exposure.
- Either partner can cancel disconnect within 7 days.
- Expired disconnect pending couples are deleted after 7 days.
- Database policies prevent private data leakage even if frontend filtering is wrong.

## Implementation Decisions

- Build with Next.js, TypeScript, Supabase Auth, Supabase Postgres, Supabase Storage, and Kakao Local API.
- Use global place records and couple-specific place records.
- Store individual reviews and expose only average ratings publicly.
- Centralize sharing eligibility in database functions and typed application helpers.
- Use server-side RPC operations for couple creation, invite-code joining, friend-code registration, friend-code regeneration, disconnect request, disconnect cancellation, and expired disconnect cleanup.
- Use separate friend recommendation and explore read models.
- Use Supabase Storage for required review photos and enforce visibility by photo type and place visibility.

## Testing Decisions

- Test external behavior and permission boundaries.
- Add database tests for RLS, RPC flows, sharing eligibility, and storage visibility.
- Add app-level tests for onboarding, place registration, review form validation, photo classification, share toggles, friend filters, explore filtering, and disconnect locked state.

## Out of Scope

- Multiple visit histories per place.
- Public written reviews.
- Photo editing or albums.
- Friend request approval.
- Native mobile apps.
- Advanced recommendation personalization.

## Source PRD

See the full PRD in the project docs.
