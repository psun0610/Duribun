'use client'

import Image from 'next/image'
import { useState } from 'react'
import {
    Bookmark,
    Compass,
    MapPin,
    Search,
    SlidersHorizontal,
    Star,
} from 'lucide-react'

import { Pill } from '@/components/ui'
import type { PublicSummarySort } from '@/features/share/types/shareSummary.types'

import type { ExploreRecommendationsPanelProps } from '../types/couplePlaceAppComponent.types'
import {
    CATEGORY_LABEL,
    COUPLE_PLACE_APP_COPY,
    EXPLORE_CATEGORY_OPTIONS,
    EXPLORE_REGION_OPTIONS,
    EXPLORE_SORT_OPTIONS,
} from '../const/couplePlaceApp.const'
import { DragScrollArea } from './DragScrollArea'

import styles from './ExploreRecommendationsPanel.module.scss'

const getRegionText = (address: string, roadAddress: string) => {
    return roadAddress || address
}

const isSupportedCategory = (category: string) => {
    return category === 'cafe' || category === 'restaurant' || category === 'activity'
}

export const ExploreRecommendationsPanel = ({
    recommendations,
}: ExploreRecommendationsPanelProps) => {
    const [sort, setSort] = useState<PublicSummarySort>('recommended')
    const [category, setCategory] = useState('all')
    const [region, setRegion] = useState('')
    const [query, setQuery] = useState('')
    const normalizedQuery = query.trim()
    const filteredRecommendations = recommendations
        .filter(recommendation => {
            if (
                category !== 'all' &&
                isSupportedCategory(category) &&
                recommendation.category !== category
            ) {
                return false
            }

            if (category === 'nature' && !recommendation.tags.includes('야외')) {
                return false
            }

            if (
                category === 'culture' &&
                !recommendation.tags.some(tag => tag.includes('사진') || tag.includes('데이트'))
            ) {
                return false
            }

            if (!region) {
                return !normalizedQuery || [
                    recommendation.placeName,
                    recommendation.coupleName,
                    recommendation.address,
                    recommendation.roadAddress,
                    ...recommendation.tags,
                ].some(text => text.includes(normalizedQuery))
            }

            const hasRegion = [recommendation.address, recommendation.roadAddress].some(
                address => address.includes(region)
            )

            if (!hasRegion) {
                return false
            }

            if (!normalizedQuery) {
                return true
            }

            return [
                recommendation.placeName,
                recommendation.coupleName,
                recommendation.address,
                recommendation.roadAddress,
                ...recommendation.tags,
            ].some(text => text.includes(normalizedQuery))
        })
        .sort((leftRecommendation, rightRecommendation) => {
            if (sort === 'rating') {
                return (
                    rightRecommendation.averageRating -
                        leftRecommendation.averageRating ||
                    Date.parse(rightRecommendation.updatedAt) -
                        Date.parse(leftRecommendation.updatedAt)
                )
            }

            if (sort === 'latest') {
                return (
                    Date.parse(rightRecommendation.updatedAt) -
                    Date.parse(leftRecommendation.updatedAt)
                )
            }

            return (
                rightRecommendation.reviewCount - leftRecommendation.reviewCount ||
                rightRecommendation.averageRating -
                    leftRecommendation.averageRating ||
                Date.parse(rightRecommendation.updatedAt) -
                    Date.parse(leftRecommendation.updatedAt)
            )
        })

    return (
        <DragScrollArea axis="y" className={styles.panel}>
            <section className={styles.searchPanel} aria-label="탐색 필터">
                <label className={styles.searchInput}>
                    <Search size={17} />
                    <input
                        aria-label={COUPLE_PLACE_APP_COPY.exploreSearchPlaceholder}
                        onChange={event => setQuery(event.target.value)}
                        placeholder={COUPLE_PLACE_APP_COPY.exploreSearchPlaceholder}
                        type="search"
                        value={query}
                    />
                    <SlidersHorizontal size={17} />
                </label>

                <DragScrollArea
                    axis="x"
                    className={styles.chipRow}
                    label={COUPLE_PLACE_APP_COPY.exploreSortLabel}
                    shouldStopPropagation
                >
                    {EXPLORE_SORT_OPTIONS.map(option => (
                        <button
                            className={
                                sort === option.value
                                    ? styles.filterChipActive
                                    : styles.filterChip
                            }
                            key={option.value}
                            onClick={() => setSort(option.value)}
                            type="button"
                        >
                            {option.label}
                        </button>
                    ))}
                </DragScrollArea>

                <DragScrollArea
                    axis="x"
                    className={styles.iconChipRow}
                    label="카테고리 필터"
                    shouldStopPropagation
                >
                    {EXPLORE_CATEGORY_OPTIONS.map(option => (
                        <button
                            className={
                                category === option.value
                                    ? styles.iconChipActive
                                    : styles.iconChip
                            }
                            key={option.value}
                            onClick={() => setCategory(option.value)}
                            type="button"
                        >
                            <span>
                                <option.icon size={17} />
                            </span>
                            {option.label}
                        </button>
                    ))}
                </DragScrollArea>

                <DragScrollArea
                    axis="x"
                    className={styles.chipRow}
                    label="지역 필터"
                    shouldStopPropagation
                >
                    <button
                        className={!region ? styles.filterChipActive : styles.filterChip}
                        onClick={() => setRegion('')}
                        type="button"
                    >
                        {COUPLE_PLACE_APP_COPY.exploreRegionAll}
                    </button>
                    {EXPLORE_REGION_OPTIONS.map(regionOption => (
                        <button
                            className={
                                region === regionOption
                                    ? styles.filterChipActive
                                    : styles.filterChip
                            }
                            key={regionOption}
                            onClick={() => setRegion(regionOption)}
                            type="button"
                        >
                            {regionOption}
                        </button>
                    ))}
                </DragScrollArea>
            </section>

            <section className={styles.recommendationList}>
                {filteredRecommendations.length > 0 ? (
                    filteredRecommendations.map(recommendation => {
                        const regionText = getRegionText(
                            recommendation.address,
                            recommendation.roadAddress
                        )

                        return (
                            <article
                                className={styles.recommendationCard}
                                key={recommendation.couplePlaceId}
                            >
                                <div className={styles.photoFrame}>
                                    {recommendation.photos[0] ? (
                                        <Image
                                            alt=""
                                            fill
                                            sizes="92px"
                                            src={recommendation.photos[0]}
                                            unoptimized
                                        />
                                    ) : (
                                        <Compass size={28} />
                                    )}
                                </div>
                                <div className={styles.recommendationBody}>
                                    <div className={styles.recommendationHeader}>
                                        <div>
                                            <h3>{recommendation.placeName}</h3>
                                            <p>{recommendation.coupleName}의 공개 추천</p>
                                        </div>
                                        <button
                                            aria-label="추천 저장"
                                            className={styles.bookmarkButton}
                                            type="button"
                                        >
                                            <Bookmark size={17} />
                                        </button>
                                    </div>

                                    <div className={styles.metaRow}>
                                        {regionText ? (
                                            <span>
                                                <MapPin size={12} />
                                                {regionText}
                                            </span>
                                        ) : null}
                                        <span>{CATEGORY_LABEL[recommendation.category]}</span>
                                    </div>

                                    <div className={styles.ratingRow}>
                                        <Pill
                                            icon={
                                                <Star
                                                    fill="currentColor"
                                                    size={12}
                                                />
                                            }
                                            tone="primary"
                                        >
                                            {recommendation.averageRating.toFixed(1)}
                                        </Pill>
                                        <span>전체 공개</span>
                                    </div>

                                    {recommendation.tags.length > 0 ? (
                                        <div className={styles.tagList}>
                                            {recommendation.tags
                                                .slice(0, 3)
                                                .map(tag => (
                                                    <span key={tag}>{tag}</span>
                                                ))}
                                        </div>
                                    ) : null}
                                </div>
                            </article>
                        )
                    })
                ) : (
                    <div className={styles.emptyRecommendations}>
                        <Compass size={28} />
                        <strong>{COUPLE_PLACE_APP_COPY.exploreEmptyTitle}</strong>
                        <p>{COUPLE_PLACE_APP_COPY.exploreEmptyDescription}</p>
                    </div>
                )}
            </section>
        </DragScrollArea>
    )
}
