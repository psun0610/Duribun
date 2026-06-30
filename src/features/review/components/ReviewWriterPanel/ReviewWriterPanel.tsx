'use client'

import {
    useActionState,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
} from 'react'
import { Save, X } from 'lucide-react'

import { Button, FieldMessage, IconButton, TextareaField } from '@/components/ui'
import { submitReview } from '@/features/review/actions'
import {
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
    const [ratingScores, setRatingScores] = useState<
        Record<string, number | null>
    >({})
    const [selectedPhotos, setSelectedPhotos] = useState<
        ReviewPhotoPreviewItem[]
    >([])
    const ratingOptions = REVIEW_RATING_OPTIONS[place.category]

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
                        kind: 'place_food',
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
                        <p className={styles.subtitle}>
                            &quot;{place.name}&quot;
                        </p>
                    </div>
                    <span aria-hidden="true" className={styles.headerSpacer} />
                </div>

                <div className={styles.content}>
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
                            <p className={styles.helpText}>
                                {REVIEW_WRITER_COPY.ratingHelp}
                            </p>
                            <div className={styles.ratingList}>
                                {ratingOptions.map(option => {
                                    const score =
                                        ratingScores[option.key] ?? null

                                    return (
                                        <div
                                            className={styles.ratingRow}
                                            key={option.key}
                                        >
                                            <div
                                                className={
                                                    styles.ratingRowHeader
                                                }
                                            >
                                                <span>{option.label}</span>
                                                <strong>
                                                    {score === null
                                                        ? '선택 전'
                                                        : `${score}점`}
                                                </strong>
                                            </div>
                                            <ReviewRatingControl
                                                ariaLabel={`${option.label} 평점 선택`}
                                                onChange={nextScore =>
                                                    handleRatingChange(
                                                        option.key,
                                                        nextScore
                                                    )
                                                }
                                                value={score}
                                            />
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
                                {REVIEW_WRITER_COPY.tagLabel}
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

                        <TextareaField
                            label={REVIEW_WRITER_COPY.oneLineLabel}
                            maxLength={40}
                            name="oneLineReview"
                            placeholder="이 장소를 한 줄로 적어주세요."
                            required
                        />

                        <div className={styles.fieldGroup}>
                            <div className={styles.photoHeader}>
                                <span className={styles.label}>
                                    {REVIEW_WRITER_COPY.photoLabel}
                                    <small>최대 10장</small>
                                </span>
                            </div>
                            <p className={styles.helpText}>
                                {REVIEW_WRITER_COPY.photoHelp}{' '}
                                {REVIEW_WRITER_COPY.photoLimitHelp}
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

                        <Button
                            leftIcon={<Save aria-hidden="true" size={16} />}
                            size="lg"
                            type="submit"
                        >
                            {REVIEW_WRITER_COPY.save}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}
