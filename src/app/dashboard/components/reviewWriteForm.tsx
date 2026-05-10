import { useRef } from 'react'
import { Star, Heart, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReviewWriteFormProps {
    fields: string[]
    ratings: Record<string, number>
    revisit: boolean
    comment: string
    loading: boolean
    error: string
    isEditing?: boolean
    hasPartnerReview: boolean
    averageRating: string | number
    newImagePreviews: string[]
    totalImageCount: number
    maxImages: number
    onRatingChange: (field: string, value: number) => void
    onRevisitChange: (value: boolean) => void
    onCommentChange: (value: string) => void
    onAddImages: (files: FileList) => void
    onRemoveNewImage: (index: number) => void
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
}

export const ReviewWriteForm = ({
    fields,
    ratings,
    revisit,
    comment,
    loading,
    error,
    isEditing = false,
    hasPartnerReview,
    averageRating,
    newImagePreviews,
    totalImageCount,
    maxImages,
    onRatingChange,
    onRevisitChange,
    onCommentChange,
    onAddImages,
    onRemoveNewImage,
    onSubmit,
    onCancel,
}: ReviewWriteFormProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onAddImages(e.target.files)
            e.target.value = ''
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
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
                                    onClick={() => onRatingChange(field, star)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            star <= (ratings[field] ?? 0)
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
                            onClick={() => onRevisitChange(option.value)}
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
                    onChange={(e) => onCommentChange(e.target.value)}
                    placeholder="이곳에 대한 특별한 기억을 남겨보세요"
                    className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                    rows={3}
                />
            </div>

            {/* 사진 업로드 */}
            <div>
                <label className="block mb-2 text-sm text-foreground/80">
                    사진{' '}
                    <span className="text-muted-foreground">
                        ({totalImageCount}/{maxImages})
                    </span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {/* 새로 선택한 이미지 미리보기 */}
                    {newImagePreviews.map((url, i) => (
                        <div key={`new-${i}`} className="relative w-20 h-20">
                            <img
                                src={url}
                                alt=""
                                className="w-20 h-20 object-cover rounded-2xl"
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveNewImage(i)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {/* 추가 버튼 */}
                    {totalImageCount < maxImages && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-20 h-20 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="text-xs">사진 추가</span>
                        </button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">종합 평점</p>
                <p className="text-3xl font-bold text-primary">
                    {averageRating} / 5.0
                </p>
            </div>

            {hasPartnerReview && (
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
                <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    variant="default"
                    disabled={
                        loading || Object.keys(ratings).length !== fields.length
                    }
                    className="flex-1"
                >
                    {loading
                        ? '저장 중...'
                        : isEditing
                          ? '수정 완료'
                          : '리뷰 저장'}
                </Button>
            </div>
        </form>
    )
}
