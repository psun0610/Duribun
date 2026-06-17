import { Star } from 'lucide-react'

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
