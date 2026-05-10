import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, Star, Clock, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/ui/utils'
import { Place } from '../types'
import { formatRatingDisplay } from '../ratingFormat'
import { useDeletePlace } from '../hooks/useDeletePlace'
import { usePartnerNickname } from '@/app/_hooks/usePartnerNickname'

type HeartFill = 'none' | 'half' | 'full'

const ReviewHeart = ({ fill }: { fill: HeartFill }) => {
    if (fill === 'full') {
        return <Heart className="w-5 h-5 text-primary fill-primary" />
    }
    if (fill === 'none') {
        return <Heart className="w-5 h-5 text-muted" />
    }
    return (
        <div className="relative w-5 h-5">
            <Heart className="absolute inset-0 w-5 h-5 text-muted fill-muted" />
            <div className="absolute inset-0 overflow-hidden w-[52%]">
                <Heart className="w-5 h-5 text-primary fill-primary" />
            </div>
        </div>
    )
}

interface PlaceCardProps {
    place: Place
    onOpen: (place: Place) => void
    /** 콤팩트 뷰: 더 작은 패딩·타이포 */
    density?: 'default' | 'compact'
}

export const PlaceCard = ({
    place,
    onOpen,
    density = 'default',
}: PlaceCardProps) => {
    const [isConfirming, setIsConfirming] = useState(false)
    const { mutate: deletePlace, isPending: isDeleting } = useDeletePlace()
    const partnerNickname = usePartnerNickname()
    const myReview = place.myReview as Record<string, unknown> | undefined
    const partnerReview = place.partnerReview as
        | Record<string, unknown>
        | undefined

    /** 상대가 올린 사진 포함 전체 장소 사진 */
    const placeImages = place.images ?? []
    const firstImageUrl = placeImages[0]?.url
    const secondImageUrl = placeImages[1]?.url
    const extraBeyondTwo = Math.max(0, placeImages.length - 2)

    const reviewStatus = (() => {
        if (myReview && partnerReview) return 'both'
        if (myReview) return 'mine-only'
        if (partnerReview) return 'partner-only'
        return 'none'
    })()

    const handleCardClick = () => {
        if (isConfirming) return
        onOpen(place)
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsConfirming(true)
    }

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        deletePlace(place.id)
    }

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsConfirming(false)
    }

    const compact = density === 'compact'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Card
                className={cn(
                    'relative cursor-pointer overflow-hidden transition-shadow hover:shadow-xl',
                    compact && '!rounded-2xl !p-4 shadow-md',
                )}
                onClick={handleCardClick}
            >
                {/* 삭제 컨펌 오버레이 */}
                <AnimatePresence>
                    {isConfirming && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash2 className="w-8 h-8 text-destructive" />
                            <div className="text-center">
                                <p className="font-semibold text-foreground">
                                    이 장소를 삭제할까요?
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    작성된 리뷰도 함께 삭제됩니다
                                </p>
                            </div>
                            <div className="flex gap-3 w-full mt-1">
                                <Button
                                    variant="outline"
                                    onClick={handleCancelDelete}
                                    className="flex-1"
                                    disabled={isDeleting}
                                >
                                    취소
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleConfirmDelete}
                                    className="flex-1"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? '삭제 중...' : '삭제'}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {placeImages.length >= 2 ? (
                    <div
                        className={cn(
                            'relative w-full overflow-hidden rounded-2xl bg-muted',
                            compact
                                ? 'mb-3 aspect-[16/10] rounded-xl'
                                : 'mb-4 aspect-[2/1]',
                        )}
                    >
                        <div className="flex h-full w-full gap-px">
                            <div className="relative min-h-0 min-w-0 flex-1">
                                <img
                                    src={firstImageUrl}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="relative min-h-0 min-w-0 flex-1">
                                <img
                                    src={secondImageUrl}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                    className="h-full w-full object-cover"
                                />
                                {extraBeyondTwo > 0 && (
                                    <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-[2px]">
                                        +{extraBeyondTwo}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : firstImageUrl ? (
                    <div
                        className={cn(
                            'relative w-full overflow-hidden rounded-2xl bg-muted',
                            compact
                                ? 'mb-3 aspect-[16/10] rounded-xl'
                                : 'mb-4 aspect-[2/1]',
                        )}
                    >
                        <img
                            src={firstImageUrl}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : null}

                <div
                    className={cn(
                        'mb-3 flex items-start justify-between',
                        compact && 'mb-2',
                    )}
                >
                    <div className="flex-1">
                        <div
                            className={cn(
                                'mb-1 flex items-center gap-2',
                                compact && 'mb-0.5',
                            )}
                        >
                            <h3
                                className={cn(
                                    'font-bold text-foreground',
                                    compact ? 'text-base' : 'text-lg',
                                )}
                            >
                                {place.name}
                            </h3>
                            <ReviewHeart
                                fill={
                                    reviewStatus === 'both'
                                        ? 'full'
                                        : reviewStatus === 'none'
                                          ? 'none'
                                          : 'half'
                                }
                            />
                        </div>
                        <p
                            className={cn(
                                'text-muted-foreground',
                                compact
                                    ? 'mb-1.5 line-clamp-2 text-xs'
                                    : 'mb-2 text-sm',
                            )}
                        >
                            {place.address}
                        </p>
                        <span
                            className={cn(
                                'inline-block rounded-full bg-secondary text-secondary-foreground',
                                compact
                                    ? 'px-2 py-0.5 text-[10px]'
                                    : 'px-3 py-1 text-xs',
                            )}
                        >
                            {place.category}
                        </span>
                    </div>

                    <button
                        onClick={handleDeleteClick}
                        className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors ml-2 -mt-1 -mr-1 text-muted-foreground"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div
                    className={cn(
                        'border-t border-border',
                        compact ? 'mt-3 pt-3' : 'mt-4 pt-4',
                    )}
                >
                    {reviewStatus === 'both' && myReview && partnerReview ? (
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: '나', review: myReview },
                                    {
                                        label: partnerNickname,
                                        review: partnerReview,
                                    },
                                ].map(({ label, review }) => (
                                    <div
                                        key={label}
                                        className={cn(
                                            'flex flex-col items-center gap-0.5 bg-background shadow',
                                            compact
                                                ? 'rounded-xl px-2 py-1.5'
                                                : 'rounded-2xl px-3 py-2',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'text-muted-foreground',
                                                compact
                                                    ? 'text-[10px]'
                                                    : 'text-xs',
                                            )}
                                        >
                                            {label}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star
                                                className={cn(
                                                    'text-primary fill-primary',
                                                    compact
                                                        ? 'h-3 w-3'
                                                        : 'h-3.5 w-3.5',
                                                )}
                                            />
                                            <span
                                                className={cn(
                                                    'font-bold text-foreground',
                                                    compact ? 'text-sm' : 'text-base',
                                                )}
                                            >
                                                {formatRatingDisplay(
                                                    review.rating,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : reviewStatus === 'mine-only' && myReview ? (
                        <div className="grid grid-cols-2 gap-2">
                            <div
                                className={cn(
                                    'flex flex-col items-center gap-0.5 bg-background shadow',
                                    compact
                                        ? 'rounded-xl px-2 py-1.5'
                                        : 'rounded-2xl px-3 py-2',
                                )}
                            >
                                <span
                                    className={cn(
                                        'text-muted-foreground',
                                        compact ? 'text-[10px]' : 'text-xs',
                                    )}
                                >
                                    내 평점
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star
                                        className={cn(
                                            'text-primary fill-primary',
                                            compact
                                                ? 'h-3 w-3'
                                                : 'h-3.5 w-3.5',
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'font-bold text-foreground',
                                            compact ? 'text-sm' : 'text-base',
                                        )}
                                    >
                                        {formatRatingDisplay(myReview.rating)}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 bg-background shadow',
                                    compact
                                        ? 'rounded-xl px-2 py-2'
                                        : 'rounded-2xl px-3 py-2',
                                )}
                            >
                                <Clock
                                    className={cn(
                                        'text-muted-foreground',
                                        compact ? 'h-3.5 w-3.5' : 'h-4 w-4',
                                    )}
                                />
                                <p
                                    className={cn(
                                        'text-center leading-tight text-muted-foreground',
                                        compact ? 'text-[10px]' : 'text-xs',
                                    )}
                                >
                                    기다리는 중...
                                </p>
                            </div>
                        </div>
                    ) : reviewStatus === 'partner-only' ? (
                        <div
                            className={cn(
                                'space-y-1 px-1 text-center',
                                compact ? 'py-1' : 'py-2',
                            )}
                        >
                            <p
                                className={cn(
                                    'font-medium text-foreground',
                                    compact ? 'text-xs' : 'text-sm',
                                )}
                            >
                                상대방이 기다리고 있어요 💌
                            </p>
                            <p
                                className={cn(
                                    'leading-snug text-muted-foreground',
                                    compact ? 'text-[10px]' : 'text-xs',
                                )}
                            >
                                리뷰를 작성하면 상대방의 리뷰를 볼 수 있어요
                            </p>
                        </div>
                    ) : (
                        <div className={cn('text-center', compact ? 'py-1' : 'py-2')}>
                            <p
                                className={cn(
                                    'text-muted-foreground',
                                    compact ? 'text-xs' : 'text-sm',
                                )}
                            >
                                아직 리뷰가 없어요
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    )
}
