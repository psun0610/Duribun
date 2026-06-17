'use client'

import { useActionState, useState } from 'react'
import { Plus, Save, X } from 'lucide-react'

import {
    Button,
    FieldMessage,
    IconButton,
    SelectField,
    TextareaField,
    TextField,
} from '@/components/ui'
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
                    <h2 className={styles.title}>
                        {REVIEW_WRITER_COPY.panelTitle}
                    </h2>
                    <p className={styles.subtitle}>{place.name}</p>
                </div>
                <IconButton
                    aria-label={REVIEW_WRITER_COPY.close}
                    onClick={onClose}
                    type="button"
                >
                    <X aria-hidden="true" size={16} />
                </IconButton>
            </div>

            <form action={submitReviewAction} className={styles.form}>
                <input
                    name="couplePlaceId"
                    type="hidden"
                    value={place.couplePlaceId}
                />

                <SelectField
                    defaultValue=""
                    label={REVIEW_WRITER_COPY.ratingLabel}
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
                </SelectField>

                <TextareaField
                    label={REVIEW_WRITER_COPY.oneLineLabel}
                    name="oneLineReview"
                    placeholder="짧게 기억하고 싶은 감상을 적어 주세요"
                    required
                />

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
                        <Button
                            disabled={photoRowCount >= MAX_PHOTO_ROWS}
                            leftIcon={<Plus aria-hidden="true" size={16} />}
                            onClick={handleAddPhotoRow}
                            size="sm"
                            type="button"
                            variant="secondary"
                        >
                            {REVIEW_WRITER_COPY.addPhoto}
                        </Button>
                    </div>
                    <p className={styles.helpText}>
                        {REVIEW_WRITER_COPY.photoHelp}{' '}
                        {REVIEW_WRITER_COPY.photoLimitHelp}
                    </p>
                    <div className={styles.photoList}>
                        {Array.from({ length: photoRowCount }).map((_, index) => (
                            <div className={styles.photoRow} key={index}>
                                <TextField
                                    accept="image/*"
                                    label={`${REVIEW_WRITER_COPY.photoRowLabel} ${
                                        index + 1
                                    }`}
                                    name="photoFile"
                                    required
                                    type="file"
                                />
                                <SelectField
                                    defaultValue="place_food"
                                    label={REVIEW_WRITER_COPY.kindLabel}
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
                                </SelectField>
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
                    type="submit"
                >
                    {REVIEW_WRITER_COPY.save}
                </Button>
            </form>
        </section>
    )
}
