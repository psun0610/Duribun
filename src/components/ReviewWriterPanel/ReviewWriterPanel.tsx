'use client'

import { useActionState, useState } from 'react'
import { Plus, Save, X } from 'lucide-react'

import { submitReview } from '@/features/review/actions'
import { REVIEW_WRITER_COPY } from '@/features/review/const/reviewSubmission.const'

import type { ReviewWriterPanelProps } from './types/reviewWriterPanel.types'
import {
    REVIEW_KIND_OPTIONS,
    REVIEW_SCORE_OPTIONS,
    REVIEW_TAG_OPTIONS,
} from './const/reviewWriterPanel.const'

import styles from './ReviewWriterPanel.module.scss'

const INITIAL_REVIEW_STATE = {
    errorMessage: '',
    successMessage: '',
}

const MAX_PHOTO_ROWS = 5

export const ReviewWriterPanel = ({ onClose, place }: ReviewWriterPanelProps) => {
    const [photoRowCount, setPhotoRowCount] = useState(1)
    const [reviewState, submitReviewAction] = useActionState(
        submitReview,
        INITIAL_REVIEW_STATE
    )

    const handleAddPhotoRow = () => {
        setPhotoRowCount(currentCount =>
            Math.min(currentCount + 1, MAX_PHOTO_ROWS)
        )
    }

    return (
        <section className={styles.panel}>
            <div className={styles.header}>
                <div className={styles.titleWrap}>
                    <h2 className={styles.title}>{REVIEW_WRITER_COPY.panelTitle}</h2>
                    <p className={styles.subtitle}>{place.name}</p>
                </div>
                <button
                    aria-label={REVIEW_WRITER_COPY.close}
                    className={styles.closeButton}
                    onClick={onClose}
                    type="button"
                >
                    <X aria-hidden="true" size={16} />
                </button>
            </div>

            <form action={submitReviewAction} className={styles.form}>
                <input
                    name="couplePlaceId"
                    type="hidden"
                    value={place.couplePlaceId}
                />

                <label className={styles.fieldGroup}>
                    <span className={styles.label}>
                        {REVIEW_WRITER_COPY.ratingLabel}
                    </span>
                    <select
                        className={styles.select}
                        defaultValue=""
                        name="rating"
                        required
                    >
                        <option value="" disabled>
                            평점을 선택해 주세요
                        </option>
                        {REVIEW_SCORE_OPTIONS.map(option => (
                            <option key={option} value={option}>
                                {option}점
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.fieldGroup}>
                    <span className={styles.label}>
                        {REVIEW_WRITER_COPY.oneLineLabel}
                    </span>
                    <textarea
                        className={styles.textarea}
                        name="oneLineReview"
                        placeholder="짧게 남기고 싶은 감상을 적어 주세요"
                        required
                    />
                </label>

                <div className={styles.fieldGroup}>
                    <span className={styles.label}>
                        {REVIEW_WRITER_COPY.tagLabel}
                    </span>
                    <p className={styles.helpText}>
                        {REVIEW_WRITER_COPY.tagsHelp}
                    </p>
                    <div className={styles.tagGrid}>
                        {REVIEW_TAG_OPTIONS[place.category].map(option => (
                            <label className={styles.tagChip} key={option.value}>
                                <input
                                    name="tagLabels"
                                    type="checkbox"
                                    value={option.value}
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <div className={styles.photoHeader}>
                        <span className={styles.label}>
                            {REVIEW_WRITER_COPY.photoLabel}
                        </span>
                        <button
                            className={styles.secondaryButton}
                            disabled={photoRowCount >= MAX_PHOTO_ROWS}
                            onClick={handleAddPhotoRow}
                            type="button"
                        >
                            <Plus aria-hidden="true" size={16} />
                            {REVIEW_WRITER_COPY.addPhoto}
                        </button>
                    </div>
                    <p className={styles.helpText}>
                        {REVIEW_WRITER_COPY.photoHelp}{' '}
                        {REVIEW_WRITER_COPY.photoLimitHelp}
                    </p>
                    <div className={styles.photoList}>
                        {Array.from({ length: photoRowCount }).map((_, index) => (
                            <div className={styles.photoRow} key={index}>
                                <label className={styles.fieldGroup}>
                                    <span className={styles.label}>
                                        {REVIEW_WRITER_COPY.photoRowLabel}{' '}
                                        {index + 1}
                                    </span>
                                    <input
                                        accept="image/*"
                                        className={styles.input}
                                        name="photoFile"
                                        type="file"
                                        required
                                    />
                                </label>
                                <label className={styles.fieldGroup}>
                                    <span className={styles.label}>
                                        {REVIEW_WRITER_COPY.kindLabel}
                                    </span>
                                    <select
                                        className={styles.select}
                                        defaultValue="place_food"
                                        name="photoKind"
                                        required
                                    >
                                        {REVIEW_KIND_OPTIONS.map(option => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {reviewState.errorMessage ? (
                    <p className={styles.errorMessage}>
                        {reviewState.errorMessage}
                    </p>
                ) : null}

                {reviewState.successMessage ? (
                    <p className={styles.successMessage}>
                        {reviewState.successMessage}
                    </p>
                ) : null}

                <button className={styles.button} type="submit">
                    <Save aria-hidden="true" size={16} />
                    {REVIEW_WRITER_COPY.save}
                </button>
            </form>
        </section>
    )
}
