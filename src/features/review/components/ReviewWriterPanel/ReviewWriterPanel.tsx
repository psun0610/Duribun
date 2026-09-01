'use client'

import {
    useActionState,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
} from 'react'
import { Star, X } from 'lucide-react'

import { Button, FieldMessage, IconButton } from '@/components/ui'
import { CATEGORY_LABEL } from '@/features/place/components/CouplePlaceApp/const/couplePlaceApp.const'
import { submitReview } from '@/features/review/actions'
import {
    DEFAULT_REVIEW_PHOTO_KIND,
    REVIEW_RATING_OPTIONS,
    REVIEW_WRITER_COPY,
} from '@/features/review/const/reviewSubmission.const'
import type { ReviewPhotoKind } from '@/features/review/types/reviewSubmission.types'

import { ReviewPhotoGrid } from './components/ReviewPhotoGrid'
import { ReviewRatingControl } from './components/ReviewRatingControl'
import {
    MODAL_CLOSE_ANIMATION_MS,
    REVIEW_TAG_OPTIONS,
} from './const/reviewWriterPanel.const'
import type {
    ReviewPhotoPreviewItem,
    ReviewWriterPanelProps,
} from './types/reviewWriterPanel.types'

import styles from './ReviewWriterPanel.module.scss'

const INITIAL_REVIEW_STATE = {
    errorMessage: '',
    successMessage: '',
}

const MAX_PHOTO_ROWS = 10
const ONE_LINE_MAX_LENGTH = 40
const RATING_ARIA_LABEL = (label: string) => label + ' 평점 선택'

const createPhotoPreviewId = (file: File, index: number) => {
    if (crypto.randomUUID) {
        return crypto.randomUUID()
    }

    return `${file.name}-${file.lastModified}-${index}-${Date.now()}`
}

export const ReviewWriterPanel = ({
    onClose,
    place,
}: ReviewWriterPanelProps) => {
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const previewUrlSetRef = useRef<Set<string>>(new Set())
    const [isClosing, setIsClosing] = useState(false)
    const [oneLineLength, setOneLineLength] = useState(0)
    const [ratingScores, setRatingScores] = useState<
        Record<string, number | null>
    >({})
    const [selectedPhotos, setSelectedPhotos] = useState<
        ReviewPhotoPreviewItem[]
    >([])
    const ratingOptions = REVIEW_RATING_OPTIONS[place.category]
    const scoredRatings = ratingOptions
        .map(option => ratingScores[option.key])
        .filter((score): score is number => typeof score === 'number')
    const averageRating =
        scoredRatings.length > 0
            ? (
                  scoredRatings.reduce((sum, score) => sum + score, 0) /
                  scoredRatings.length
              ).toFixed(1)
            : null

    const submitReviewWithPhotos = async (
        previousState: typeof INITIAL_REVIEW_STATE,
        formData: FormData
    ) => {
        selectedPhotos.forEach(photo => {
            formData.append('photoFile', photo.file)
            formData.append('photoKind', photo.kind)
        })

        return submitReview(previousState, formData)
    }

    const [reviewState, submitReviewAction] = useActionState(
        submitReviewWithPhotos,
        INITIAL_REVIEW_STATE
    )

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
            }

            previewUrlSetRef.current.forEach(previewUrl => {
                URL.revokeObjectURL(previewUrl)
            })
            previewUrlSetRef.current.clear()
        }
    }, [])

    const handleOpenPhotoPicker = () => {
        fileInputRef.current?.click()
    }

    const handlePhotoFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? [])

        if (files.length === 0) {
            return
        }

        setSelectedPhotos(currentPhotos => {
            const availableCount = MAX_PHOTO_ROWS - currentPhotos.length
            const nextPhotos = files
                .slice(0, availableCount)
                .map((file, index): ReviewPhotoPreviewItem => {
                    const previewUrl = URL.createObjectURL(file)
                    previewUrlSetRef.current.add(previewUrl)

                    return {
                        file,
                        id: createPhotoPreviewId(file, index),
                        kind: DEFAULT_REVIEW_PHOTO_KIND,
                        previewUrl,
                    }
                })

            return [...currentPhotos, ...nextPhotos]
        })

        event.target.value = ''
    }

    const handlePhotoKindChange = (id: string, kind: ReviewPhotoKind) => {
        setSelectedPhotos(currentPhotos =>
            currentPhotos.map(photo =>
                photo.id === id
                    ? {
                          ...photo,
                          kind,
                      }
                    : photo
            )
        )
    }

    const handleRatingChange = (key: string, score: number) => {
        setRatingScores(currentScores => ({
            ...currentScores,
            [key]: score,
        }))
    }

    const handleRemovePhoto = (id: string) => {
        setSelectedPhotos(currentPhotos => {
            const removedPhoto = currentPhotos.find(photo => photo.id === id)

            if (removedPhoto) {
                URL.revokeObjectURL(removedPhoto.previewUrl)
                previewUrlSetRef.current.delete(removedPhoto.previewUrl)
            }

            return currentPhotos.filter(photo => photo.id !== id)
        })
    }

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
            aria-labelledby="review-writer-title"
            aria-modal="true"
            className={`${styles.overlay} ${isClosing ? styles.closing : ''}`}
            role="dialog"
        >
            <div className={styles.backdrop} onClick={handleClosePanel} />
            <div className={styles.panel}>
                <div className={styles.header}>
                    <IconButton
                        aria-label={REVIEW_WRITER_COPY.close}
                        className={styles.closeButton}
                        onClick={handleClosePanel}
                        type="button"
                        variant="plain"
                    >
                        <X aria-hidden="true" size={17} />
                    </IconButton>
                    <div className={styles.headerText}>
                        <h2 className={styles.title} id="review-writer-title">
                            {REVIEW_WRITER_COPY.panelTitle}
                        </h2>
                    </div>
                    <span aria-hidden="true" className={styles.headerSpacer} />
                </div>

                <div className={styles.content}>
                    <div className={styles.placeSummary}>
                        <span
                            aria-hidden="true"
                            className={styles.placeThumb}
                        />
                        <span className={styles.placeSummaryBody}>
                            <strong>{place.name}</strong>
                            <span>{CATEGORY_LABEL[place.category]}</span>
                        </span>
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
                                {averageRating ? (
                                    <span className={styles.averagePill}>
                                        <Star aria-hidden="true" size={13} />
                                        {averageRating}
                                    </span>
                                ) : null}
                            </span>
                            <p className={styles.helpText}>
                                {REVIEW_WRITER_COPY.ratingHelp}
                            </p>
                            <div className={styles.ratingCard}>
                                {ratingOptions.map(option => {
                                    const score =
                                        ratingScores[option.key] ?? null

                                    return (
                                        <div
                                            className={styles.ratingRow}
                                            key={option.key}
                                        >
                                            <span
                                                className={
                                                    styles.ratingRowLabel
                                                }
                                            >
                                                {option.label}
                                            </span>
                                            <ReviewRatingControl
                                                ariaLabel={RATING_ARIA_LABEL(
                                                    option.label
                                                )}
                                                onChange={nextScore =>
                                                    handleRatingChange(
                                                        option.key,
                                                        nextScore
                                                    )
                                                }
                                                value={score}
                                            />
                                            <span
                                                className={
                                                    score === null
                                                        ? styles.ratingRowScoreEmpty
                                                        : styles.ratingRowScore
                                                }
                                            >
                                                {score === null
                                                    ? '-'
                                                    : score.toFixed(1)}
                                            </span>
                                            <input
                                                name="ratingKey"
                                                type="hidden"
                                                value={option.key}
                                            />
                                            <input
                                                name="ratingLabel"
                                                type="hidden"
                                                value={option.label}
                                            />
                                            <input
                                                name="ratingScore"
                                                type="hidden"
                                                value={score ?? ''}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <span className={styles.label}>
                                <span className={styles.labelWithHint}>
                                    {REVIEW_WRITER_COPY.tagLabel}
                                    <small>{REVIEW_WRITER_COPY.tagsHelp}</small>
                                </span>
                            </span>
                            <div className={styles.tagGrid}>
                                {REVIEW_TAG_OPTIONS[place.category].map(
                                    option => (
                                        <label
                                            className={styles.tagChip}
                                            key={option.value}
                                        >
                                            <input
                                                name="tagLabels"
                                                type="checkbox"
                                                value={option.value}
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <span className={styles.label}>
                                {REVIEW_WRITER_COPY.oneLineLabel}
                                <span className={styles.counter}>
                                    {oneLineLength} / {ONE_LINE_MAX_LENGTH}
                                </span>
                            </span>
                            <textarea
                                className={styles.oneLineInput}
                                maxLength={ONE_LINE_MAX_LENGTH}
                                name="oneLineReview"
                                onChange={event =>
                                    setOneLineLength(event.target.value.length)
                                }
                                placeholder={
                                    REVIEW_WRITER_COPY.oneLinePlaceholder
                                }
                                required
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <span className={styles.label}>
                                <span className={styles.labelWithHint}>
                                    {REVIEW_WRITER_COPY.photoLabel}
                                    <small>
                                        {REVIEW_WRITER_COPY.photoLimitHelp}
                                    </small>
                                </span>
                                <span className={styles.counter}>
                                    {selectedPhotos.length} / {MAX_PHOTO_ROWS}
                                </span>
                            </span>
                            <p className={styles.helpText}>
                                {REVIEW_WRITER_COPY.photoHelp}
                            </p>
                            <ReviewPhotoGrid
                                fileInputRef={fileInputRef}
                                maxPhotoCount={MAX_PHOTO_ROWS}
                                onAddClick={handleOpenPhotoPicker}
                                onFilesChange={handlePhotoFilesChange}
                                onKindChange={handlePhotoKindChange}
                                onRemove={handleRemovePhoto}
                                photos={selectedPhotos}
                            />
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

                        <div className={styles.saveBar}>
                            <Button size="lg" type="submit">
                                {REVIEW_WRITER_COPY.save}
                            </Button>
                            <p className={styles.saveNote}>
                                {REVIEW_WRITER_COPY.saveNote}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
