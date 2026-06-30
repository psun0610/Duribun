import { Star } from 'lucide-react'

import { Badge, Pill } from '@/components/ui'

import {
    REVIEW_DETAIL_COPY,
    REVIEW_PHOTO_KIND_LABEL,
} from '../const/reviewDetailPanel.const'
import type { ReviewDetailCardProps } from '../types/reviewDetailPanel.types'
import { formatRating } from '../utils/reviewDetailPanel.utils'

import styles from '../ReviewDetailPanel.module.scss'

export const ReviewCard = ({
    currentUserId,
    review,
}: ReviewDetailCardProps) => {
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
                        {REVIEW_DETAIL_COPY.ratingLabel}{' '}
                        {formatRating(review.rating)}
                    </p>
                </div>
                <Pill
                    className={styles.ratingPill}
                    icon={<Star aria-hidden="true" size={14} />}
                    tone="rating"
                >
                    {formatRating(review.rating)}
                </Pill>
            </div>

            <p className={styles.oneLineReview}>{review.oneLineReview}</p>

            {review.tags.length > 0 ? (
                <div className={styles.tagList}>
                    {review.tags.map(tag => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </div>
            ) : null}

            {review.photos.length > 0 ? (
                <div className={styles.photoGrid}>
                    {review.photos.map(photo => (
                        <figure
                            className={styles.photoCard}
                            key={photo.storagePath}
                        >
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
            ) : null}
        </article>
    )
}
