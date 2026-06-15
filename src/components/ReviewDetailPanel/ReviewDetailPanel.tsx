'use client'

import { useActionState } from 'react'
import { Star, X } from 'lucide-react'

import { updateCouplePlaceSharing } from '@/features/place/actions'

import {
    REVIEW_DETAIL_COPY,
    REVIEW_PHOTO_KIND_LABEL,
    REVIEW_STATUS_LABEL,
} from './const/reviewDetailPanel.const'
import type {
    ReviewDetailCardProps,
    ReviewDetailPanelProps,
} from './types/reviewDetailPanel.types'

import styles from './ReviewDetailPanel.module.scss'

const INITIAL_SHARING_STATE = {
    errorMessage: '',
}

const formatRating = (rating: number) => {
    const rounded = Math.round(rating * 10) / 10

    return Number.isInteger(rounded) ? `${rounded.toFixed(0)}.0` : `${rounded}`
}

const ReviewCard = ({ currentUserId, review }: ReviewDetailCardProps) => {
    const isMine = review.authorId === currentUserId

    return (
        <article className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
                <div>
                    <p className={styles.reviewLabel}>
                        {isMine
                            ? REVIEW_DETAIL_COPY.myReview
                            : REVIEW_DETAIL_COPY.partnerReview}
                    </p>
                    <p className={styles.reviewMeta}>
                        {REVIEW_DETAIL_COPY.ratingLabel} {formatRating(review.rating)}
                    </p>
                </div>
                <span className={styles.ratingPill}>
                    <Star aria-hidden="true" size={14} />
                    {formatRating(review.rating)}
                </span>
            </div>

            <p className={styles.oneLineReview}>{review.oneLineReview}</p>

            <div className={styles.tagList}>
                {review.tags.map(tag => (
                    <span className={styles.tagChip} key={tag}>
                        {tag}
                    </span>
                ))}
            </div>

            <div className={styles.photoGrid}>
                {review.photos.map(photo => (
                    <figure className={styles.photoCard} key={photo.storagePath}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            alt={`${REVIEW_PHOTO_KIND_LABEL[photo.kind]} 사진`}
                            className={styles.photo}
                            src={photo.signedUrl}
                        />
                        <figcaption className={styles.photoCaption}>
                            {REVIEW_PHOTO_KIND_LABEL[photo.kind]}
                        </figcaption>
                    </figure>
                ))}
            </div>
        </article>
    )
}

export const ReviewDetailPanel = ({
    currentUserId,
    detail,
    onClose,
    place,
}: ReviewDetailPanelProps) => {
    const [sharingState, updateSharingAction] = useActionState(
        updateCouplePlaceSharing,
        INITIAL_SHARING_STATE
    )
    const canShowPublicly = Boolean(
        detail &&
            detail.reviewCount >= 2 &&
            detail.reviews.some(review =>
                review.photos.some(photo => photo.kind === 'place_food')
            )
    )

    return (
        <section className={styles.panel}>
            <div className={styles.header}>
                <div className={styles.titleWrap}>
                    <span className={styles.badge}>
                        {place.isPublic
                            ? REVIEW_DETAIL_COPY.publicBadge
                            : REVIEW_DETAIL_COPY.privateBadge}
                    </span>
                    <h2 className={styles.title}>{REVIEW_DETAIL_COPY.reviewTitle}</h2>
                    <p className={styles.subtitle}>
                        {place.name} / {REVIEW_STATUS_LABEL[detail?.reviewStatus ?? 'none']}
                    </p>
                </div>
                <button
                    aria-label={REVIEW_DETAIL_COPY.close}
                    className={styles.closeButton}
                    onClick={onClose}
                    type="button"
                >
                    <X aria-hidden="true" size={16} />
                </button>
            </div>

            {detail ? (
                <>
                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryCard}>
                            <span className={styles.summaryLabel}>
                                {REVIEW_DETAIL_COPY.averageRating}
                            </span>
                            <strong className={styles.summaryValue}>
                                {detail.averageRating === null
                                    ? '-'
                                    : formatRating(detail.averageRating)}
                            </strong>
                        </div>
                        <div className={styles.summaryCard}>
                            <span className={styles.summaryLabel}>
                                {REVIEW_DETAIL_COPY.reviewCount}
                            </span>
                            <strong className={styles.summaryValue}>
                                {detail.reviewCount} / 2
                            </strong>
                        </div>
                    </div>

                    <p className={styles.statusCopy}>
                        {REVIEW_STATUS_LABEL[detail.reviewStatus]}
                    </p>

                    <form
                        action={updateSharingAction}
                        className={styles.shareBox}
                    >
                        <input
                            name="couplePlaceId"
                            type="hidden"
                            value={place.couplePlaceId}
                        />
                        <input
                            name="isPublic"
                            type="hidden"
                            value={place.isPublic ? 'false' : 'true'}
                        />
                        <div className={styles.shareText}>
                            <span className={styles.shareTitle}>
                                {REVIEW_DETAIL_COPY.shareTitle}
                            </span>
                            <strong>
                                {place.isPublic
                                    ? REVIEW_DETAIL_COPY.publicLabel
                                    : REVIEW_DETAIL_COPY.privateLabel}
                                {' / '}
                                {canShowPublicly
                                    ? REVIEW_DETAIL_COPY.shareReady
                                    : REVIEW_DETAIL_COPY.shareWaiting}
                            </strong>
                        </div>
                        <button className={styles.shareButton} type="submit">
                            {place.isPublic
                                ? REVIEW_DETAIL_COPY.turnPrivate
                                : REVIEW_DETAIL_COPY.turnPublic}
                        </button>
                        {sharingState.errorMessage ? (
                            <p className={styles.errorMessage}>
                                {sharingState.errorMessage}
                            </p>
                        ) : null}
                    </form>

                    {detail.reviews.length > 0 ? (
                        <div className={styles.reviewList}>
                            {detail.reviews.map(review => (
                                <ReviewCard
                                    currentUserId={currentUserId}
                                    key={review.id}
                                    review={review}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>
                            {REVIEW_DETAIL_COPY.noReview}
                        </p>
                    )}
                </>
            ) : (
                <p className={styles.emptyState}>{REVIEW_DETAIL_COPY.noDetail}</p>
            )}
        </section>
    )
}
