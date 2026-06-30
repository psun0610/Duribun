'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Compass, MapPin, Search, Star } from 'lucide-react'

import { Badge, Pill } from '@/components/ui'
import type {
    PublicSummaryCategoryFilter,
    PublicSummarySort,
} from '@/features/share/types/shareSummary.types'

import type { ExploreRecommendationsPanelProps } from '../types/couplePlaceAppComponent.types'
import {
    CATEGORY_LABEL,
    COUPLE_PLACE_APP_COPY,
    EXPLORE_CATEGORY_OPTIONS,
    EXPLORE_REGION_OPTIONS,
    EXPLORE_SORT_OPTIONS,
} from '../const/couplePlaceApp.const'

import styles from './ExploreRecommendationsPanel.module.scss'

const getRegionText = (address: string, roadAddress: string) => {
    return roadAddress || address
}

export const ExploreRecommendationsPanel = ({
    recommendations,
}: ExploreRecommendationsPanelProps) => {
    const [sort, setSort] = useState<PublicSummarySort>('recommended')
    const [category, setCategory] =
        useState<PublicSummaryCategoryFilter>('all')
    const [region, setRegion] = useState('')
    const filteredRecommendations = recommendations
        .filter(recommendation => {
            if (category !== 'all' && recommendation.category !== category) {
                return false
            }

            if (!region) {
                return true
            }

            return [recommendation.address, recommendation.roadAddress].some(
                address => address.includes(region)
            )
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
        <div className={styles.panel}>
            <section className={styles.searchPanel} aria-label="탐색 필터">
                <div className={styles.searchInput}>
                    <Search size={17} />
                    <span>{COUPLE_PLACE_APP_COPY.exploreDescription}</span>
                </div>

                <div
                    aria-label={COUPLE_PLACE_APP_COPY.exploreSortLabel}
                    className={styles.chipRow}
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
                </div>

                <div className={styles.iconChipRow} aria-label="카테고리 필터">
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
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className={styles.chipRow} aria-label="지역 필터">
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
                </div>
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
                                    </div>

                                    <div className={styles.metaRow}>
                                        <Badge size="sm" variant="primary">
                                            {CATEGORY_LABEL[recommendation.category]}
                                        </Badge>
                                        {regionText ? (
                                            <span>
                                                <MapPin size={12} />
                                                {regionText}
                                            </span>
                                        ) : null}
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
        </div>
    )
}
