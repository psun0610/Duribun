'use client'

import { useState, useEffect } from 'react'
import { apiCall } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { X, Star, Heart } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Place {
    id: string
    name: string
    category: string
    myReview?: Record<string, unknown>
    partnerReview?: Record<string, unknown>
    bothCompleted: boolean
}

interface ReviewModalProps {
    place: Place
    onClose: () => void
    onReviewAdded: () => void
}

export const ReviewModal = ({
    place,
    onClose,
    onReviewAdded,
}: ReviewModalProps) => {
    const [ratings, setRatings] = useState<Record<string, number>>({})
    const [revisit, setRevisit] = useState(true)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const isViewMode = !!(place.myReview && place.bothCompleted)

    useEffect(() => {
        if (place.myReview) {
            setRatings((place.myReview.ratings as Record<string, number>) || {})
            setRevisit((place.myReview.revisit as boolean) ?? true)
            setComment((place.myReview.comment as string) || '')
        }
    }, [place.myReview])

    const getCategoryFields = () => {
        if (place.category === '식당')
            return ['맛', '분위기', '가성비', '청결도', '만족도']
        if (place.category === '카페')
            return ['커피맛', '디저트', '좌석', '감성', '만족도']
        if (place.category === '액티비티')
            return ['재미', '활동량', '소요시간', '만족도']
        return ['평가']
    }

    const fields = getCategoryFields()

    const handleRatingChange = (field: string, value: number) => {
        setRatings((prev) => ({ ...prev, [field]: value }))
    }

    const getAverageRating = () => {
        const values = Object.values(ratings)
        if (values.length === 0) return 0
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await apiCall('/reviews', {
                method: 'POST',
                body: JSON.stringify({
                    placeId: place.id,
                    ratings,
                    revisit,
                    comment,
                    rating: parseFloat(String(getAverageRating())),
                }),
            })

            if (place.partnerReview) {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#FF9B9B', '#FFD4C4', '#FFCBA4'],
                    shapes: ['circle'],
                    scalar: 1.2,
                })
                setTimeout(() => onReviewAdded(), 1500)
            } else {
                onReviewAdded()
            }
        } catch (err: unknown) {
            setError((err as Error).message || '리뷰 작성에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    const myReview = place.myReview as Record<string, unknown> | undefined
    const partnerReview = place.partnerReview as
        | Record<string, unknown>
        | undefined

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

                {isViewMode ? (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { label: '내 리뷰', review: myReview },
                                { label: '상대 리뷰', review: partnerReview },
                            ].map(({ label, review }) => {
                                const commentText =
                                    typeof review?.comment === 'string'
                                        ? review.comment
                                        : ''

                                return (
                                    <div key={label} className="space-y-4">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-primary fill-primary" />
                                            {label}
                                        </h3>
                                        <div className="space-y-2">
                                            {fields.map((field) => (
                                                <div
                                                    key={field}
                                                    className="flex justify-between items-center"
                                                >
                                                    <span className="text-sm text-muted-foreground">
                                                        {field}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map(
                                                            (star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-4 h-4 ${
                                                                        star <=
                                                                        ((
                                                                            review?.ratings as Record<
                                                                                string,
                                                                                number
                                                                            >
                                                                        )?.[
                                                                            field
                                                                        ] || 0)
                                                                            ? 'text-primary fill-primary'
                                                                            : 'text-muted-foreground'
                                                                    }`}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-3 border-t border-border">
                                            <p className="text-sm text-muted-foreground mb-1">
                                                총점
                                            </p>
                                            <p className="text-2xl font-bold text-primary">
                                                {String(review?.rating)} / 5.0
                                            </p>
                                        </div>
                                        {commentText && (
                                            <div className="bg-muted/30 rounded-2xl p-4">
                                                <p className="text-sm">
                                                    {commentText}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <Button
                            variant="default"
                            onClick={onClose}
                            className="w-full"
                        >
                            닫기
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">세부 평가</h3>
                            {fields.map((field) => (
                                <div key={field}>
                                    <label className="block mb-2 text-sm text-foreground/80">
                                        {field}
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                    handleRatingChange(
                                                        field,
                                                        star,
                                                    )
                                                }
                                                className="transition-transform hover:scale-110"
                                                disabled={isViewMode}
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${
                                                        star <=
                                                        (ratings[field] || 0)
                                                            ? 'text-primary fill-primary'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-foreground/80">
                                재방문 의사
                            </label>
                            <div className="flex gap-2">
                                {[
                                    { value: true, label: '다시 오고 싶어요' },
                                    { value: false, label: '별로예요' },
                                ].map((option) => (
                                    <button
                                        key={option.label}
                                        type="button"
                                        onClick={() => setRevisit(option.value)}
                                        disabled={isViewMode}
                                        className={`flex-1 py-3 rounded-2xl transition-all ${
                                            revisit === option.value
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-foreground/80">
                                한줄 코멘트
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={isViewMode}
                                placeholder="이곳에 대한 특별한 기억을 남겨보세요"
                                className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="bg-secondary/30 rounded-2xl p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-1">
                                종합 평점
                            </p>
                            <p className="text-3xl font-bold text-primary">
                                {getAverageRating()} / 5.0
                            </p>
                        </div>

                        {partnerReview && !myReview && (
                            <div className="bg-primary/10 rounded-2xl p-4 text-center">
                                <Heart className="w-8 h-8 text-primary fill-primary mx-auto mb-2" />
                                <p className="text-sm text-foreground">
                                    상대방이 먼저 리뷰를 작성했어요!
                                    <br />
                                    리뷰를 완성하면 함께 볼 수 있어요
                                </p>
                            </div>
                        )}

                        {error && (
                            <p className="text-destructive text-sm text-center">
                                {error}
                            </p>
                        )}

                        {!isViewMode && (
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={
                                        loading ||
                                        Object.keys(ratings).length !==
                                            fields.length
                                    }
                                    className="flex-1"
                                >
                                    {loading ? '저장 중...' : '리뷰 저장'}
                                </Button>
                            </div>
                        )}
                    </form>
                )}
            </motion.div>
        </div>
    )
}
