import { Plus, X } from 'lucide-react'

import {
    REVIEW_KIND_OPTIONS,
    REVIEW_WRITER_PANEL_COPY,
} from '../const/reviewWriterPanel.const'
import type { ReviewPhotoGridProps } from '../types/reviewWriterPanel.types'

import styles from '../ReviewWriterPanel.module.scss'

export const ReviewPhotoGrid = ({
    fileInputRef,
    maxPhotoCount,
    onAddClick,
    onFilesChange,
    onKindChange,
    onRemove,
    photos,
}: ReviewPhotoGridProps) => {
    const canAddPhoto = photos.length < maxPhotoCount

    return (
        <div className={styles.photoGrid}>
            {photos.map((photo, index) => (
                <article className={styles.photoTile} key={photo.id}>
                    <div className={styles.photoPreviewFrame}>
                        <img
                            alt={`${REVIEW_WRITER_PANEL_COPY.photoRowLabel} ${
                                index + 1
                            }`}
                            className={styles.photoPreview}
                            src={photo.previewUrl}
                        />
                        <button
                            aria-label={`${REVIEW_WRITER_PANEL_COPY.photoRowLabel} ${
                                index + 1
                            } 삭제`}
                            className={styles.photoRemoveButton}
                            onClick={() => onRemove(photo.id)}
                            type="button"
                        >
                            <X aria-hidden="true" size={13} />
                        </button>
                    </div>
                    <div className={styles.photoKindSegment}>
                        {REVIEW_KIND_OPTIONS.map(option => (
                            <label
                                className={
                                    option.value === photo.kind
                                        ? styles.photoKindOptionActive
                                        : styles.photoKindOption
                                }
                                key={option.value}
                            >
                                <input
                                    checked={option.value === photo.kind}
                                    onChange={() =>
                                        onKindChange(photo.id, option.value)
                                    }
                                    type="radio"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </article>
            ))}

            {canAddPhoto ? (
                <button
                    className={styles.photoAddTile}
                    onClick={onAddClick}
                    type="button"
                >
                    <Plus aria-hidden="true" size={24} />
                    <span>{REVIEW_WRITER_PANEL_COPY.addPhoto}</span>
                </button>
            ) : null}

            <input
                ref={fileInputRef}
                accept="image/*"
                className={styles.photoInput}
                multiple
                onChange={onFilesChange}
                type="file"
            />
        </div>
    )
}
