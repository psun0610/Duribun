'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Heart, Lock, ShieldCheck, Star, X } from 'lucide-react'

import { Button, FieldMessage, IconButton, Pill } from '@/components/ui'
import { updateCouplePlaceSharing } from '@/features/place/actions'

import { ReviewCard } from './components/ReviewCard'
import {
    MODAL_CLOSE_ANIMATION_MS,
    REVIEW_DETAIL_COPY,
    REVIEW_STATUS_LABEL,
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
    const canShowPublicly = Boolean(
        detail &&
            detail.reviewCount >= 2 &&
            detail.reviews.some(review =>
                review.photos.some(photo => photo.kind === 'place_food')
            )
    )

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
                <div className={styles.hero}>
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
                <div className={styles.header}>
                    <div className={styles.titleWrap}>
                        <h2 className={styles.title} id="review-detail-title">
                            {place.name}
                        </h2>
                        <p className={styles.subtitle}>
                            {REVIEW_DETAIL_COPY.reviewTitle} ·{' '}
                            {
                                REVIEW_STATUS_LABEL[
                                    detail?.reviewStatus ?? 'none'
                                ]
                            }
                        </p>
                    </div>
                </div>

                <div className={styles.content}>
                    {detail ? (
                        <>
                            <div className={styles.metaRow}>
                                <Pill
                                    icon={<Star aria-hidden="true" size={14} />}
                                    tone="rating"
                                >
                                    {detail.averageRating === null
                                        ? '-'
                                        : formatRating(detail.averageRating)}
                                </Pill>
                                <span>{REVIEW_DETAIL_COPY.averageRating}</span>
                            </div>

                            <div className={styles.reviewStatusBox}>
                                <h3>{REVIEW_DETAIL_COPY.ourReviewStatus}</h3>
                                <div className={styles.statusCards}>
                                    <div className={styles.statusCardMine}>
                                        <span>
                                            <Heart aria-hidden="true" size={18} />
                                        </span>
                                        <strong>
                                            {REVIEW_DETAIL_COPY.myReviewShort}
                                        </strong>
                                        <p>{REVIEW_STATUS_LABEL[detail.reviewStatus]}</p>
                                    </div>
                                    <div className={styles.statusCardPartner}>
                                        <span>
                                            <Heart aria-hidden="true" size={18} />
                                        </span>
                                        <strong>
                                            {REVIEW_DETAIL_COPY.partnerReviewShort}
                                        </strong>
                                        <p>{detail.reviewCount} / 2</p>
                                    </div>
                                </div>
                            </div>

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
                                <div className={styles.shareIcon}>
                                    <Lock aria-hidden="true" size={18} />
                                </div>
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
                                <Button size="sm" type="submit">
                                    {place.isPublic
                                        ? REVIEW_DETAIL_COPY.turnPrivate
                                        : REVIEW_DETAIL_COPY.turnPublic}
                                </Button>
                                {sharingState.errorMessage ? (
                                    <FieldMessage variant="error">
                                        {sharingState.errorMessage}
                                    </FieldMessage>
                                ) : null}
                            </form>

                            <div className={styles.privacyNotice}>
                                <ShieldCheck aria-hidden="true" size={18} />
                                <p>{REVIEW_DETAIL_COPY.privacyNotice}</p>
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
                        </>
                    ) : (
                        <p className={styles.emptyState}>
                            {REVIEW_DETAIL_COPY.noDetail}
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}
