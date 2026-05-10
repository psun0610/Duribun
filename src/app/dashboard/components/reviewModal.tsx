'use client'

import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { ReviewModalProps } from '../types'
import { useReviewForm } from '../hooks/useReviewForm'
import { ReviewViewMode } from './reviewViewMode'
import { ReviewWriteForm } from './reviewWriteForm'
import { PlaceImageCarousel } from './placeImageCarousel'
import { useClickOutside } from '@/app/_hooks/useClickOutside'

export const ReviewModal = ({
    place,
    onClose,
    onReviewAdded,
}: ReviewModalProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)
    useClickOutside(modalRef, onClose)

    const isViewMode = !!(place.myReview && place.bothCompleted)
    const showViewMode = isViewMode && !isEditing

    const handleReviewComplete = () => {
        if (isEditing) {
            setIsEditing(false)
        } else {
            onReviewAdded()
        }
    }

    const {
        ratings,
        revisit,
        setRevisit,
        comment,
        setComment,
        loading,
        error,
        fields,
        myReview,
        partnerReview,
        handleRatingChange,
        getAverageRating,
        handleSubmit,
        existingMyPlaceImages,
        newImagePreviews,
        totalImageCount,
        maxImages,
        addImages,
        markExistingImageRemoved,
        resetImageDraftState,
        requirePhotoWhenPlaceHasNoImages,
        removeNewImage,
    } = useReviewForm(place, handleReviewComplete)

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card rounded-3xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="mb-6 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 pr-2">
                        <h2 className="text-2xl font-bold leading-tight text-foreground break-words">
                            {place.name}
                        </h2>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                            <span className="inline-flex shrink-0 items-center rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-secondary-foreground">
                                {place.category}
                            </span>
                            <span className="shrink-0">리뷰</span>
                            {isEditing && (
                                <span className="text-primary font-medium">
                                    · 수정 중
                                </span>
                            )}
                        </div>
                        <p className="mt-1.5 text-sm leading-snug text-muted-foreground break-words">
                            {place.address}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 리뷰 수정 화면에서는 캐러셀 숨김 */}
                {!isEditing && (
                    <PlaceImageCarousel images={place.images} />
                )}

                {showViewMode && myReview && partnerReview ? (
                    <ReviewViewMode
                        myReview={myReview}
                        partnerReview={partnerReview}
                        fields={fields}
                        onClose={onClose}
                        onEdit={() => setIsEditing(true)}
                    />
                ) : (
                    <ReviewWriteForm
                        fields={fields}
                        ratings={ratings}
                        revisit={revisit}
                        comment={comment}
                        loading={loading}
                        error={error}
                        isEditing={isEditing}
                        hasPartnerReview={!!partnerReview && !myReview}
                        averageRating={getAverageRating()}
                        existingMyPlaceImages={existingMyPlaceImages}
                        newImagePreviews={newImagePreviews}
                        totalImageCount={totalImageCount}
                        maxImages={maxImages}
                        requirePhotoWhenPlaceHasNoImages={
                            requirePhotoWhenPlaceHasNoImages
                        }
                        onRatingChange={handleRatingChange}
                        onRevisitChange={setRevisit}
                        onCommentChange={setComment}
                        onAddImages={addImages}
                        onMarkExistingImageRemoved={markExistingImageRemoved}
                        onRemoveNewImage={removeNewImage}
                        onSubmit={handleSubmit}
                        onCancel={
                            isEditing
                                ? () => {
                                      resetImageDraftState()
                                      setIsEditing(false)
                                  }
                                : onClose
                        }
                    />
                )}
            </motion.div>
        </div>
    )
}
