'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Heart, Lock, MapPin, Star, Unlock, X } from 'lucide-react'

import { FieldMessage, IconButton } from '@/components/ui'
import { updateCouplePlaceSharing } from '@/features/place/actions'
import { CATEGORY_LABEL } from '@/features/place/components/CouplePlaceApp/const/couplePlaceApp.const'
import {
    REVIEW_AUTHOR_STATUS_LABEL,
    REVIEW_STATUS_MESSAGE,
} from '@/features/review/const/reviewStatus.const'

import { ReviewCard } from './components/ReviewCard'
import {
    MODAL_CLOSE_ANIMATION_MS,
    REVIEW_DETAIL_COPY,
} from './const/reviewDetailPanel.const'
import type { ReviewDetailPanelProps } from './types/reviewDetailPanel.types'
import { formatRating } from './utils/reviewDetailPanel.utils'

import styles from './ReviewDetailPanel.module.scss'

const INITIAL_SHARING_STATE = {
    errorMessage: '',
}

export const ReviewDetailPanel = ({
    currentUserId,
    detail,
    onClose,
    place,
}: ReviewDetailPanelProps) => {
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [isClosing, setIsClosing] = useState(false)
    const [sharingState, updateSharingAction] = useActionState(
        updateCouplePlaceSharing,
        INITIAL_SHARING_STATE
    )
    const hasMyReview = Boolean(
        detail?.reviews.some(review => review.authorId === currentUserId)
    )
    const hasPartnerReview = Boolean(
        detail?.reviews.some(review => review.authorId !== currentUserId)
    )
    const canShowPublicly = Boolean(
        detail &&
        detail.reviewCount >= 2 &&
        detail.reviews.some(review =>
            review.photos.some(photo => photo.kind === 'place_food')
        )
    )
    // 히어로는 장소·음식 사진을 먼저 씁니다. 없으면 남긴 사진 중 첫 장입니다.
    const allPhotos = detail?.reviews.flatMap(review => review.photos) ?? []
    const heroPhotoUrl =
        allPhotos.find(photo => photo.kind === 'place_food')?.signedUrl ??
        allPhotos[0]?.signedUrl ??
        null

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
            }
        }
    }, [])

    const handleClosePanel = () => {
        if (closeTimerRef.current) {
            return
        }

        setIsClosing(true)
        closeTimerRef.current = setTimeout(() => {
            closeTimerRef.current = null
            onClose()
        }, MODAL_CLOSE_ANIMATION_MS)
    }

    return (
        <section
            aria-labelledby="review-detail-title"
            aria-modal="true"
            className={`${styles.overlay} ${isClosing ? styles.closing : ''}`}
            role="dialog"
        >
            <div className={styles.backdrop} onClick={handleClosePanel} />
            <div className={styles.panel}>
                <div className={styles.content}>
                    <div
                        className={styles.hero}
                        style={
                            heroPhotoUrl
                                ? { backgroundImage: `url(${heroPhotoUrl})` }
                                : undefined
                        }
                    >
                        {heroPhotoUrl ? null : (
                            <MapPin
                                aria-hidden="true"
                                className={styles.heroPlaceholder}
                                size={40}
                            />
                        )}
                        <IconButton
                            aria-label={REVIEW_DETAIL_COPY.close}
                            className={styles.heroClose}
                            onClick={handleClosePanel}
                            type="button"
                            variant="plain"
                        >
                            <X aria-hidden="true" size={16} />
                        </IconButton>
                    </div>

                    <div className={styles.contentBody}>
                        <div className={styles.titleCard}>
                            <div className={styles.titleWrap}>
                                <h2
                                    className={styles.title}
                                    id="review-detail-title"
                                >
                                    {place.name}
                                </h2>
                                <p className={styles.subtitle}>
                                    {CATEGORY_LABEL[place.category]}
                                </p>
                            </div>
                            <span className={styles.titleRating}>
                                <Star aria-hidden="true" size={14} />
                                {detail?.averageRating == null
                                    ? '-'
                                    : formatRating(detail.averageRating)}
                            </span>
                        </div>

                        {detail ? (
                            <>
                                <div className={styles.reviewStatusBox}>
                                    <h3>
                                        {REVIEW_DETAIL_COPY.ourReviewStatus}
                                    </h3>
                                    <p className={styles.statusMessage}>
                                        {
                                            REVIEW_STATUS_MESSAGE[
                                                detail.reviewStatus
                                            ]
                                        }
                                    </p>
                                    <div className={styles.statusCards}>
                                        <div className={styles.statusCardMine}>
                                            <span
                                                className={styles.statusAvatar}
                                            >
                                                <Heart
                                                    aria-hidden="true"
                                                    size={15}
                                                />
                                            </span>
                                            <span
                                                className={
                                                    styles.statusCardBody
                                                }
                                            >
                                                <small>
                                                    {
                                                        REVIEW_DETAIL_COPY.myReviewShort
                                                    }
                                                </small>
                                                <strong>
                                                    {hasMyReview
                                                        ? REVIEW_AUTHOR_STATUS_LABEL.done
                                                        : REVIEW_AUTHOR_STATUS_LABEL.pending}
                                                </strong>
                                            </span>
                                        </div>
                                        <div
                                            className={styles.statusCardPartner}
                                        >
                                            <span
                                                className={
                                                    styles.statusAvatarPartner
                                                }
                                            >
                                                <Heart
                                                    aria-hidden="true"
                                                    size={15}
                                                />
                                            </span>
                                            <span
                                                className={
                                                    styles.statusCardBody
                                                }
                                            >
                                                <small>
                                                    {
                                                        REVIEW_DETAIL_COPY.partnerReviewShort
                                                    }
                                                </small>
                                                <strong>
                                                    {hasPartnerReview
                                                        ? REVIEW_AUTHOR_STATUS_LABEL.done
                                                        : REVIEW_AUTHOR_STATUS_LABEL.pending}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

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
                                        value={
                                            place.isPublic ? 'false' : 'true'
                                        }
                                    />
                                    <span className={styles.shareIcon}>
                                        {place.isPublic ? (
                                            <Unlock
                                                aria-hidden="true"
                                                size={18}
                                            />
                                        ) : (
                                            <Lock
                                                aria-hidden="true"
                                                size={18}
                                            />
                                        )}
                                    </span>
                                    <span className={styles.shareText}>
                                        <strong>
                                            {place.isPublic
                                                ? REVIEW_DETAIL_COPY.sharePublicTitle
                                                : REVIEW_DETAIL_COPY.sharePrivateTitle}
                                        </strong>
                                        <small>
                                            {canShowPublicly
                                                ? REVIEW_DETAIL_COPY.shareHint
                                                : REVIEW_DETAIL_COPY.shareWaiting}
                                        </small>
                                    </span>
                                    <button
                                        className={styles.shareAction}
                                        type="submit"
                                    >
                                        {REVIEW_DETAIL_COPY.turnPublic}
                                    </button>
                                    {sharingState.errorMessage ? (
                                        <FieldMessage variant="error">
                                            {sharingState.errorMessage}
                                        </FieldMessage>
                                    ) : null}
                                </form>
                            </>
                        ) : (
                            <p className={styles.emptyState}>
                                {REVIEW_DETAIL_COPY.noDetail}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
