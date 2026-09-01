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
                <p className={styles.reviewLabel}>
                    {isMine
                        ? REVIEW_DETAIL_COPY.myReview
                        : REVIEW_DETAIL_COPY.partnerReview}
                </p>
                <span className={styles.reviewScore}>
                    {formatRating(review.rating)}
                </span>
            </div>

            <p className={styles.oneLineReview}>{review.oneLineReview}</p>

            {review.tags.length > 0 ? (
                <div className={styles.tagList}>
                    {review.tags.map(tag => (
                        <span className={styles.tagChip} key={tag}>
                            {tag}
                        </span>
                    ))}
                </div>
            ) : null}

            {review.ratings.length > 0 ? (
                <div className={styles.ratingBreakdown}>
                    {review.ratings.map(rating => (
                        <span
                            className={styles.ratingBreakdownItem}
                            key={rating.key}
                        >
                            {rating.label}
                            <strong>{formatRating(rating.score)}</strong>
                        </span>
                    ))}
                </div>
            ) : null}

            {review.photos.length > 0 ? (
                <div className={styles.photoGrid}>
                    {review.photos.map(photo => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            alt={`${REVIEW_PHOTO_KIND_LABEL[photo.kind]} 사진`}
                            className={styles.photo}
                            key={photo.storagePath}
                            src={photo.signedUrl}
                        />
                    ))}
                </div>
            ) : null}
        </article>
    )
}
