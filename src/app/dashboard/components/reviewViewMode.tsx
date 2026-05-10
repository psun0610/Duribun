import { Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReviewPanelProps {
    label: string
    review: Record<string, unknown>
    fields: string[]
}

const ReviewPanel = ({ label, review, fields }: ReviewPanelProps) => {
    const commentText =
        typeof review.comment === 'string' ? review.comment : ''

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
        </div>
    )
}

interface ReviewViewModeProps {
    myReview: Record<string, unknown>
    partnerReview: Record<string, unknown>
    fields: string[]
    onClose: () => void
}

export const ReviewViewMode = ({
    myReview,
    partnerReview,
    fields,
    onClose,
}: ReviewViewModeProps) => (
    <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <ReviewPanel label="내 리뷰" review={myReview} fields={fields} />
            <ReviewPanel
                label="상대 리뷰"
                review={partnerReview}
                fields={fields}
            />
        </div>
        <Button variant="default" onClick={onClose} className="w-full">
            닫기
        </Button>
    </div>
)
