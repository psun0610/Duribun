'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PlaceImage } from '../types'
import { ImageViewer } from './imageViewer'
import { usePartnerNickname } from '@/app/_hooks/usePartnerNickname'

interface PlaceImageCarouselProps {
    images: PlaceImage[]
}

export const PlaceImageCarousel = ({ images }: PlaceImageCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [viewerIndex, setViewerIndex] = useState<number | null>(null)
    const partnerNickname = usePartnerNickname()

    if (images.length === 0) return null

    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < images.length - 1
    const current = images[currentIndex]

    return (
        <>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-6">
                {/* 이미지 */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={current.url}
                        alt=""
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() => setViewerIndex(currentIndex)}
                        draggable={false}
                    />
                </AnimatePresence>

                {/* 누가 올렸는지 배지 */}
                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                        {current.isMine ? '나' : partnerNickname}
                    </span>
                </div>

                {/* 이전 버튼 */}
                {hasPrev && (
                    <button
                        onClick={() => setCurrentIndex((i) => i - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* 다음 버튼 */}
                {hasNext && (
                    <button
                        onClick={() => setCurrentIndex((i) => i + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                {/* 인디케이터 */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full transition-all ${
                                    i === currentIndex
                                        ? 'bg-white w-4'
                                        : 'bg-white/50 w-1.5'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* 장수 표시 */}
                <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-black/50 text-white backdrop-blur-sm">
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
