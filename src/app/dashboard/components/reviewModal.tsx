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
        removeExistingPlaceImage,
        removingExistingImageId,
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
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            {place.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {place.category} 리뷰
                            {isEditing && (
                                <span className="ml-2 text-primary font-medium">
                                    · 수정 중
                                </span>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 장소 사진 캐러셀 (상단 공통 표시) */}
                <PlaceImageCarousel images={place.images} />

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
                        removingExistingImageId={removingExistingImageId}
                        onRatingChange={handleRatingChange}
                        onRevisitChange={setRevisit}
                        onCommentChange={setComment}
                        onAddImages={addImages}
                        onRemoveExistingPlaceImage={removeExistingPlaceImage}
                        onRemoveNewImage={removeNewImage}
                        onSubmit={handleSubmit}
                        onCancel={isEditing ? () => setIsEditing(false) : onClose}
                    />
                )}
            </motion.div>
        </div>
    )
}
