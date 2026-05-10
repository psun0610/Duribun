'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageViewerProps {
    images: string[]
    initialIndex: number
    currentIndex: number
    onChangeIndex: (index: number) => void
    onClose: () => void
}

export const ImageViewer = ({
    images,
    currentIndex,
    onChangeIndex,
    onClose,
}: ImageViewerProps) => {
    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < images.length - 1

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft' && hasPrev) onChangeIndex(currentIndex - 1)
            if (e.key === 'ArrowRight' && hasNext) onChangeIndex(currentIndex + 1)
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [currentIndex, hasPrev, hasNext, onClose, onChangeIndex])

    return (
        // 바깥 배경 클릭 시 닫힘
        <div
            className="fixed inset-0 bg-black/85 z-[60] flex items-center justify-center"
            onClick={onClose}
        >
            {/* 닫기 */}
            <button
                onClick={(e) => { e.stopPropagation(); onClose() }}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
            >
                <X className="w-6 h-6" />
            </button>

            {/* 이미지 + 네비게이션 묶음 */}
            <div
                className="relative flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 이전 버튼 */}
                <button
                    onClick={() => hasPrev && onChangeIndex(currentIndex - 1)}
                    disabled={!hasPrev}
                    className="p-1.5 text-white/80 hover:text-white disabled:opacity-20 transition-colors shrink-0"
                >
                    <ChevronLeft className="w-7 h-7" />
                </button>

                {/* 이미지 */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt=""
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="max-w-[80vw] max-h-[85vh] object-contain rounded-2xl select-none"
                        draggable={false}
                    />
                </AnimatePresence>

                {/* 다음 버튼 */}
                <button
                    onClick={() => hasNext && onChangeIndex(currentIndex + 1)}
                    disabled={!hasNext}
                    className="p-1.5 text-white/80 hover:text-white disabled:opacity-20 transition-colors shrink-0"
                >
                    <ChevronRight className="w-7 h-7" />
                </button>
            </div>

            {/* 인디케이터 */}
            {images.length > 1 && (
                <div
                    className="absolute bottom-6 flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => onChangeIndex(i)}
                            className={`h-1.5 rounded-full transition-all ${
                                i === currentIndex
                                    ? 'bg-white w-4'
                                    : 'bg-white/40 w-1.5'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
