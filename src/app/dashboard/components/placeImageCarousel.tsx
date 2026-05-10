'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PlaceImage } from '../types'
import { ImageViewer } from './imageViewer'
import { usePartnerNickname } from '@/app/_hooks/usePartnerNickname'

const SWIPE_DISTANCE_PX = 48
/** 이보다 덜 움직이면 탭(확대)으로 간주 */
const TAP_MAX_MOVE_PX = 12

interface PlaceImageCarouselProps {
    images: PlaceImage[]
}

export const PlaceImageCarousel = ({ images }: PlaceImageCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [viewerIndex, setViewerIndex] = useState<number | null>(null)
    const partnerNickname = usePartnerNickname()

    const pointerStartRef = useRef<{ x: number; y: number } | null>(null)

    if (images.length === 0) return null

    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < images.length - 1
    const current = images[currentIndex]

    const handleSlidePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        pointerStartRef.current = { x: e.clientX, y: e.clientY }
        if (images.length >= 2) {
            e.currentTarget.setPointerCapture(e.pointerId)
        }
    }

    const handleSlidePointerUp = (
        currentHasPrev: boolean,
        currentHasNext: boolean,
        index: number,
    ) =>
        (e: React.PointerEvent<HTMLDivElement>) => {
            const start = pointerStartRef.current
            pointerStartRef.current = null
            if (images.length >= 2) {
                try {
                    e.currentTarget.releasePointerCapture(e.pointerId)
                } catch {
                    /* ignore */
                }
            }

            if (!start) return

            const dx = e.clientX - start.x
            const dy = e.clientY - start.y
            const moved = Math.hypot(dx, dy)

            if (images.length >= 2) {
                const isHorizontalSwipe =
                    Math.abs(dx) >= Math.abs(dy) &&
                    Math.abs(dx) >= SWIPE_DISTANCE_PX

                if (isHorizontalSwipe) {
                    if (dx < 0 && currentHasNext) {
                        setCurrentIndex(index + 1)
                        return
                    }
                    if (dx > 0 && currentHasPrev) {
                        setCurrentIndex(index - 1)
                        return
                    }
                }
            }

            /* 드래그/스와이프가 아닌 탭·클릭일 때만 확대 */
            if (moved <= TAP_MAX_MOVE_PX) {
                setViewerIndex(index)
            }
        }

    const handleSlidePointerCancel = (
        e: React.PointerEvent<HTMLDivElement>,
    ) => {
        pointerStartRef.current = null
        if (images.length >= 2) {
            try {
                e.currentTarget.releasePointerCapture(e.pointerId)
            } catch {
                /* ignore */
            }
        }
    }

    return (
        <>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-6">
                {/* 스와이프·탭 확대 영역 (버튼·도트와 분리해 포인터 캡처 충돌 방지) */}
                <div
                    role="presentation"
                    className="absolute inset-0 z-0 touch-pan-y"
                    onPointerDown={handleSlidePointerDown}
                    onPointerUp={handleSlidePointerUp(
                        hasPrev,
                        hasNext,
                        currentIndex,
                    )}
                    onPointerCancel={handleSlidePointerCancel}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            src={current.url}
                            alt=""
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pointer-events-none h-full w-full object-cover cursor-zoom-in select-none"
                            draggable={false}
                        />
                    </AnimatePresence>
                </div>

                {/* 누가 올렸는지 배지 */}
                <div className="pointer-events-none absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                        {current.isMine ? '나' : partnerNickname}
                    </span>
                </div>

                {/* 이전 버튼 */}
                {hasPrev && (
                    <button
                        type="button"
                        aria-label="이전 사진"
                        onClick={() => setCurrentIndex((i) => i - 1)}
                        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white transition-colors hover:bg-black/60"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* 다음 버튼 */}
                {hasNext && (
                    <button
                        type="button"
                        aria-label="다음 사진"
                        onClick={() => setCurrentIndex((i) => i + 1)}
                        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white transition-colors hover:bg-black/60"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                {/* 인디케이터 */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`${i + 1}번째 사진 보기`}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full transition-all ${
                                    i === currentIndex
                                        ? 'w-4 bg-white'
                                        : 'w-1.5 bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* 장수 표시 */}
                <div className="pointer-events-none absolute top-3 right-3 z-10">
                    <span className="rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
                        {currentIndex + 1} / {images.length}
                    </span>
                </div>
            </div>

            {/* 썸네일 스트립 */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden transition-all ${
                                i === currentIndex
                                    ? 'ring-2 ring-primary ring-offset-1'
                                    : 'opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={img.url}
                                alt=""
                                className="w-full h-full object-cover"
                                draggable={false}
                            />
                        </button>
                    ))}
                </div>
            )}

            {viewerIndex !== null && (
                <ImageViewer
                    images={images.map((img) => img.url)}
                    initialIndex={viewerIndex}
                    currentIndex={viewerIndex}
                    onChangeIndex={setViewerIndex}
                    onClose={() => setViewerIndex(null)}
                />
            )}
        </>
    )
}
