'use client'

import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { ReviewModalProps } from '../types'
import { useReviewForm } from '../hooks/useReviewForm'
import { ReviewViewMode } from './reviewViewMode'
import { ReviewWriteForm } from './reviewWriteForm'

export const ReviewModal = ({
    place,
    onClose,
    onReviewAdded,
}: ReviewModalProps) => {
    const isViewMode = !!(place.myReview && place.bothCompleted)

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
    } = useReviewForm(place, onReviewAdded)

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
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
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isViewMode && myReview && partnerReview ? (
                    <ReviewViewMode
                        myReview={myReview}
                        partnerReview={partnerReview}
                        fields={fields}
                        onClose={onClose}
                    />
                ) : (
                    <ReviewWriteForm
                        fields={fields}
                        ratings={ratings}
                        revisit={revisit}
                        comment={comment}
                        loading={loading}
                        error={error}
                        hasPartnerReview={!!partnerReview && !myReview}
                        averageRating={getAverageRating()}
                        onRatingChange={handleRatingChange}
                        onRevisitChange={setRevisit}
                        onCommentChange={setComment}
                        onSubmit={handleSubmit}
                        onClose={onClose}
                    />
                )}
            </motion.div>
        </div>
    )
}
