'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { MoreVertical, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ReviewModalProps } from '../types'
import { useReviewForm } from '../hooks/useReviewForm'
import { useDeletePlace } from '../hooks/useDeletePlace'
import { ReviewViewMode } from './reviewViewMode'
import { ReviewWriteForm } from './reviewWriteForm'
import { PlaceImageCarousel } from './placeImageCarousel'
import { useClickOutside } from '@/app/_hooks/useClickOutside'

export const ReviewModal = ({
    place,
    onClose,
    onReviewAdded,
}: ReviewModalProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const { mutate: deletePlace, isPending: isDeleting } = useDeletePlace()
    const modalRef = useRef<HTMLDivElement>(null)
    const handleModalBackdropIntent = useCallback(() => {
        if (deleteAlertOpen) return
        onClose()
    }, [deleteAlertOpen, onClose])
    useClickOutside(modalRef, handleModalBackdropIntent, true)

    const isViewMode = !!(place.myReview && place.bothCompleted)
    const showViewMode = isViewMode && !isEditing

    const handleReviewComplete = () => {
        if (isEditing) {
            setIsEditing(false)
        } else {
            onReviewAdded()
        }
    }

    const {
        ratings,
        revisit,
        setRevisit,
        comment,
        setComment,
        loading,
        error,
        fields,
        myReview,
        partnerReview,
        handleRatingChange,
        getAverageRating,
        handleSubmit,
        existingMyPlaceImages,
        newImagePreviews,
        totalImageCount,
        maxImages,
        addImages,
        markExistingImageRemoved,
        resetImageDraftState,
        requirePhotoWhenPlaceHasNoImages,
        removeNewImage,
    } = useReviewForm(place, handleReviewComplete)

    const handleConfirmDeletePlace = () => {
        deletePlace(place.id, {
            onSuccess: () => {
                setDeleteAlertOpen(false)
                onClose()
            },
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent className="z-[80] gap-4 border-border shadow-xl sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>장소를 삭제할까요?</AlertDialogTitle>
                        <AlertDialogDescription>
                            작성된 리뷰도 함께 삭제됩니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            취소
                        </AlertDialogCancel>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={handleConfirmDeletePlace}
                        >
                            {isDeleting ? '…' : '삭제하기'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card rounded-3xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="mb-6 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-start gap-1">
                            <h2 className="min-w-0 flex-1 text-2xl font-bold leading-tight text-foreground break-words">
                                {place.name}
                            </h2>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                                        aria-label="장소 옵션"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    sideOffset={4}
                                    className="z-[80] min-w-[10rem]"
                                >
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={isDeleting}
                                        onSelect={() =>
                                            setDeleteAlertOpen(true)
                                        }
                                    >
                                        <Trash2 />
                                        삭제하기
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                            <span className="inline-flex shrink-0 items-center rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-secondary-foreground">
                                {place.category}
                            </span>
                            <span className="shrink-0">리뷰</span>
                            {isEditing && (
                                <span className="text-primary font-medium">
                                    · 수정 중
                                </span>
                            )}
                        </div>
                        <p className="mt-1.5 text-sm leading-snug text-muted-foreground break-words">
                            {place.address}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 리뷰 수정 화면에서는 캐러셀 숨김 */}
                {!isEditing && (
                    <PlaceImageCarousel images={place.images} />
                )}

                {showViewMode && myReview && partnerReview ? (
                    <ReviewViewMode
                        myReview={myReview}
                        partnerReview={partnerReview}
                        fields={fields}
                        onClose={onClose}
                        onEdit={() => setIsEditing(true)}
                    />
                ) : (
                    <ReviewWriteForm
                        fields={fields}
                        ratings={ratings}
                        revisit={revisit}
                        comment={comment}
                        loading={loading}
                        error={error}
                        isEditing={isEditing}
                        hasPartnerReview={!!partnerReview && !myReview}
                        averageRating={getAverageRating()}
                        existingMyPlaceImages={existingMyPlaceImages}
                        newImagePreviews={newImagePreviews}
                        totalImageCount={totalImageCount}
                        maxImages={maxImages}
                        requirePhotoWhenPlaceHasNoImages={
                            requirePhotoWhenPlaceHasNoImages
                        }
                        onRatingChange={handleRatingChange}
                        onRevisitChange={setRevisit}
                        onCommentChange={setComment}
                        onAddImages={addImages}
                        onMarkExistingImageRemoved={markExistingImageRemoved}
                        onRemoveNewImage={removeNewImage}
                        onSubmit={handleSubmit}
                        onCancel={
                            isEditing
                                ? () => {
                                      resetImageDraftState()
                                      setIsEditing(false)
                                  }
                                : onClose
                        }
                    />
                )}
            </motion.div>
        </div>
    )
}
