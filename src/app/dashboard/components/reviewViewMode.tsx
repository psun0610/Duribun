import { useState } from 'react'
import { Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePartnerNickname } from '@/app/_hooks/usePartnerNickname'
import { ImageViewer } from './imageViewer'

interface ReviewPanelProps {
    label: string
    review: Record<string, unknown>
    fields: string[]
}

const ReviewPanel = ({ label, review, fields }: ReviewPanelProps) => {
    const [viewerIndex, setViewerIndex] = useState<number | null>(null)

    const commentText =
        typeof review.comment === 'string' ? review.comment : ''
    const images = Array.isArray(review.images) ? (review.images as string[]) : []

    return (
        <div className="space-y-4">
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
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                        star <=
                                        ((
                                            review.ratings as Record<
                                                string,
                                                number
                                            >
                                        )?.[field] ?? 0)
                                            ? 'text-primary fill-primary'
                                            : 'text-muted-foreground'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">총점</p>
                <p className="text-2xl font-bold text-primary">
                    {String(review.rating)} / 5.0
                </p>
            </div>
            {commentText && (
                <div className="bg-muted/30 rounded-2xl p-4">
                    <p className="text-sm">{commentText}</p>
                </div>
            )}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5">
                    {images.map((url, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setViewerIndex(i)}
                            className="focus:outline-none"
                        >
                            <img
                                src={url}
                                alt=""
                                className="w-full aspect-square object-cover rounded-xl hover:opacity-80 transition-opacity"
                            />
                        </button>
                    ))}
                </div>
            )}

            {viewerIndex !== null && (
                <ImageViewer
                    images={images}
                    initialIndex={viewerIndex}
                    currentIndex={viewerIndex}
                    onChangeIndex={setViewerIndex}
                    onClose={() => setViewerIndex(null)}
                />
            )}
        </div>
    )
}

interface ReviewViewModeProps {
    myReview: Record<string, unknown>
    partnerReview: Record<string, unknown>
    fields: string[]
    onClose: () => void
    onEdit: () => void
}

export const ReviewViewMode = ({
    myReview,
    partnerReview,
    fields,
    onClose,
    onEdit,
}: ReviewViewModeProps) => {
    const partnerNickname = usePartnerNickname()

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <ReviewPanel
                    label="내 리뷰"
                    review={myReview}
                    fields={fields}
                />
                <ReviewPanel
                    label={`${partnerNickname}의 리뷰`}
                    review={partnerReview}
                    fields={fields}
                />
            </div>
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={onEdit}
                    className="flex-1"
                >
                    내 리뷰 수정
                </Button>
                <Button
                    variant="default"
                    onClick={onClose}
                    className="flex-1"
                >
                    닫기
                </Button>
            </div>
        </div>
    )
}
