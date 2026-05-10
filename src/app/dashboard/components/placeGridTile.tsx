'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, MapPin, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Place } from '../types'
import { useDeletePlace } from '../hooks/useDeletePlace'

type HeartFill = 'none' | 'half' | 'full'

const TileHeart = ({ fill }: { fill: HeartFill }) => {
    if (fill === 'full') {
        return (
            <Heart className="h-3.5 w-3.5 fill-primary text-primary drop-shadow" />
        )
    }
    if (fill === 'none') {
        return (
            <Heart className="h-3.5 w-3.5 fill-white/25 text-white/80 drop-shadow" />
        )
    }
    return (
        <div className="relative h-3.5 w-3.5 drop-shadow">
            <Heart className="absolute inset-0 h-3.5 w-3.5 fill-white/25 text-white/80" />
            <div className="absolute inset-0 w-[52%] overflow-hidden">
                <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            </div>
        </div>
    )
}

interface PlaceGridTileProps {
    place: Place
    onOpen: (place: Place) => void
}

export const PlaceGridTile = ({ place, onOpen }: PlaceGridTileProps) => {
    const [isConfirming, setIsConfirming] = useState(false)
    const { mutate: deletePlace, isPending: isDeleting } = useDeletePlace()
    const myReview = place.myReview as Record<string, unknown> | undefined
    const partnerReview = place.partnerReview as
        | Record<string, unknown>
        | undefined

    const firstImageUrl = place.images?.[0]?.url

    const reviewStatus = (() => {
        if (myReview && partnerReview) return 'both'
        if (myReview) return 'mine-only'
        if (partnerReview) return 'partner-only'
        return 'none'
    })()

    const heartFill: HeartFill =
        reviewStatus === 'both'
            ? 'full'
            : reviewStatus === 'none'
              ? 'none'
              : 'half'

    const handleOpen = () => {
        if (!isConfirming) onOpen(place)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative flex flex-col"
        >
            <div className="group relative aspect-square w-full overflow-hidden rounded-lg bg-muted ring-1 ring-border/60 transition-transform hover:ring-primary/30 hover:brightness-[1.02]">
                {firstImageUrl ? (
                    <img
                        src={firstImageUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-muted p-2">
                        <MapPin className="h-6 w-6 text-muted-foreground" />
                        <span className="text-center text-[10px] font-medium text-muted-foreground">
                            {place.category}
                        </span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleOpen}
                    aria-label={`${place.name} 리뷰 열기`}
                    className="absolute inset-0 z-[1]"
                />

                <div className="absolute left-1.5 top-1.5 z-[2]">
                    <TileHeart fill={heartFill} />
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsConfirming(true)
                    }}
                    aria-label="장소 삭제"
                    className="absolute right-1.5 top-1.5 z-[3] rounded-full bg-black/35 p-1 text-white/90 opacity-100 backdrop-blur-sm transition-opacity hover:bg-destructive/90 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
            <p className="mt-1 truncate text-center text-[11px] font-semibold leading-tight text-foreground">
                {place.name}
            </p>

            <AnimatePresence>
                {isConfirming && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/96 p-2 text-center backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-xs font-semibold leading-tight text-foreground">
                            삭제할까요?
                        </p>
                        <div className="flex w-full gap-1.5">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 flex-1 text-xs"
                                disabled={isDeleting}
                                onClick={() => setIsConfirming(false)}
                            >
                                취소
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="h-8 flex-1 text-xs"
                                disabled={isDeleting}
                                onClick={() => deletePlace(place.id)}
                            >
                                {isDeleting ? '…' : '삭제'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
