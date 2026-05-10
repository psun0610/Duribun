import { motion } from 'motion/react'
import { Heart, Star, Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Place } from '../types'

interface PlaceCardProps {
    place: Place
    onOpen: (place: Place) => void
}

export const PlaceCard = ({ place, onOpen }: PlaceCardProps) => {
    const myReview = place.myReview as Record<string, unknown> | undefined
    const partnerReview = place.partnerReview as
        | Record<string, unknown>
        | undefined

    const reviewStatus = (() => {
        if (myReview && partnerReview) return 'both'
        if (myReview) return 'mine-only'
        if (partnerReview) return 'partner-only'
        return 'none'
    })()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Card
                className="hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => reviewStatus !== 'both' && onOpen(place)}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-foreground">
                                {place.name}
                            </h3>
                            {place.bothCompleted ? (
                                <Heart className="w-5 h-5 text-primary fill-primary" />
                            ) : (
                                <div className="flex">
                                    <Heart
                                        className={`w-5 h-5 ${myReview ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                                    />
                                    <Heart
                                        className={`w-5 h-5 -ml-2 ${partnerReview ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                                    />
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            {place.address}
                        </p>
                        <span className="inline-block px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                            {place.category}
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                    {reviewStatus === 'both' && myReview && partnerReview ? (
                        <div className="space-y-2">
                            {[
                                { label: '내 평점', review: myReview },
                                { label: '상대 평점', review: partnerReview },
                            ].map(({ label, review }) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-sm text-muted-foreground">
                                        {label}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-primary fill-primary" />
                                        <span className="text-sm font-medium">
                                            {String(review.rating)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onOpen(place)
                                }}
                                className="w-full mt-2 text-sm text-primary hover:underline"
                            >
                                자세히 보기
                            </button>
                        </div>
                    ) : reviewStatus === 'mine-only' ? (
                        <div className="text-center py-2">
                            <EyeOff className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                            <p className="text-sm text-muted-foreground">
                                상대방이 리뷰 작성 중...
                            </p>
                        </div>
                    ) : reviewStatus === 'partner-only' ? (
                        <div className="text-center py-2">
                            <Eye className="w-5 h-5 text-primary mx-auto mb-1" />
                            <p className="text-sm text-primary font-medium">
                                리뷰를 작성해주세요!
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-sm text-muted-foreground">
                                아직 리뷰가 없어요
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    )
}
