'use client'

import { useActionState, useState } from 'react'
import { ImagePlus, Plus, Save, Star, X } from 'lucide-react'

import { Button, FieldMessage, IconButton, TextareaField, TextField } from '@/components/ui'
import { submitReview } from '@/features/review/actions'
import { REVIEW_WRITER_COPY } from '@/features/review/const/reviewSubmission.const'
import type { ReviewPhotoKind } from '@/features/review/types/reviewSubmission.types'

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
    const [photoKinds, setPhotoKinds] = useState<ReviewPhotoKind[]>([
        'place_food',
    ])
    const [reviewState, submitReviewAction] = useActionState(
        submitReview,
        INITIAL_REVIEW_STATE
    )

    const handleAddPhotoRow = () => {
        setPhotoRowCount(currentCount =>
            Math.min(currentCount + 1, MAX_PHOTO_ROWS)
        )
        setPhotoKinds(currentKinds =>
            currentKinds.length >= MAX_PHOTO_ROWS
                ? currentKinds
                : [...currentKinds, 'place_food']
        )
    }

    const handlePhotoKindChange = (
        index: number,
        value: ReviewPhotoKind
    ) => {
        setPhotoKinds(currentKinds =>
            currentKinds.map((kind, kindIndex) =>
                kindIndex === index ? value : kind
            )
        )
    }

    return (
        <section className={styles.panel}>
            <div className={styles.header}>
                <IconButton
                    aria-label={REVIEW_WRITER_COPY.close}
                    onClick={onClose}
                    type="button"
                    variant="plain"
                >
                    <X aria-hidden="true" size={17} />
                </IconButton>
                <h2 className={styles.title}>
                    {REVIEW_WRITER_COPY.panelTitle}
                </h2>
                <Button size="sm" type="button" variant="ghost">
                    임시저장
                </Button>
            </div>

            <form action={submitReviewAction} className={styles.form}>
                <input
                    name="couplePlaceId"
                    type="hidden"
                    value={place.couplePlaceId}
                />

                <div className={styles.fieldGroup}>
                    <span className={styles.label}>
                        {REVIEW_WRITER_COPY.ratingLabel}
                    </span>
                    <div className={styles.ratingGrid}>
                        {REVIEW_SCORE_OPTIONS.map(option => (
                            <label className={styles.ratingChip} key={option}>
                                <input
                                    name="rating"
                                    required
                                    type="radio"
                                    value={option}
                                />
                                <Star aria-hidden="true" size={13} />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <span className={styles.label}>
                        {REVIEW_WRITER_COPY.tagLabel}
                        <small>복수 선택</small>
                    </span>
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

                <TextareaField
                    label={REVIEW_WRITER_COPY.oneLineLabel}
                    maxLength={40}
                    name="oneLineReview"
                    placeholder="이 장소의 매력을 한 줄로 남겨보세요."
                    required
                />

                <div className={styles.fieldGroup}>
                    <div className={styles.photoHeader}>
                        <span className={styles.label}>
                            {REVIEW_WRITER_COPY.photoLabel}
                            <small>최대 5장</small>
                        </span>
                        <Button
                            disabled={photoRowCount >= MAX_PHOTO_ROWS}
                            leftIcon={<Plus aria-hidden="true" size={16} />}
                            onClick={handleAddPhotoRow}
                            size="sm"
                            type="button"
                            variant="secondary"
                        >
                            추가
                        </Button>
                    </div>
                    <p className={styles.helpText}>
                        {REVIEW_WRITER_COPY.photoHelp}{' '}
                        {REVIEW_WRITER_COPY.photoLimitHelp}
                    </p>
                    <div className={styles.photoList}>
                        {Array.from({ length: photoRowCount }).map((_, index) => (
                            <div className={styles.photoRow} key={index}>
                                <div className={styles.fileBox}>
                                    <ImagePlus aria-hidden="true" size={22} />
                                    <TextField
                                        accept="image/*"
                                        label={`${REVIEW_WRITER_COPY.photoRowLabel} ${
                                            index + 1
                                        }`}
                                        name="photoFile"
                                        required
                                        type="file"
                                    />
                                </div>
                                <div className={styles.kindGrid}>
                                    {REVIEW_KIND_OPTIONS.map(option => (
                                        <label
                                            className={styles.kindChip}
                                            key={option.value}
                                        >
                                            <input
                                                checked={
                                                    option.value ===
                                                    photoKinds[index]
                                                }
                                                onChange={() =>
                                                    handlePhotoKindChange(
                                                        index,
                                                        option.value
                                                    )
                                                }
                                                name={`photoKind-${index}`}
                                                type="radio"
                                                value={option.value}
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <input
                                    name="photoKind"
                                    type="hidden"
                                    value={photoKinds[index] ?? 'place_food'}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {reviewState.errorMessage ? (
                    <FieldMessage variant="error">
                        {reviewState.errorMessage}
                    </FieldMessage>
                ) : null}

                {reviewState.successMessage ? (
                    <FieldMessage variant="success">
                        {reviewState.successMessage}
                    </FieldMessage>
                ) : null}

                <Button
                    leftIcon={<Save aria-hidden="true" size={16} />}
                    size="lg"
                    type="submit"
                >
                    {REVIEW_WRITER_COPY.save}
                </Button>
            </form>
        </section>
    )
}
