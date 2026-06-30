'use client'

import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { Star } from 'lucide-react'

import type { ReviewRatingControlProps } from '../types/reviewWriterPanel.types'

import styles from '../ReviewWriterPanel.module.scss'

const RATING_MIN = 0.5
const RATING_MAX = 5
const RATING_STEP = 0.5
const STAR_COUNT = 5

const clampRating = (value: number) => {
    const steppedValue = Math.round(value / RATING_STEP) * RATING_STEP

    return Math.min(RATING_MAX, Math.max(RATING_MIN, steppedValue))
}

const getRatingFromStarRect = (
    clientX: number,
    rect: DOMRect,
    starIndex: number
) => {
    const isLeftHalf = clientX - rect.left < rect.width / 2

    return clampRating(starIndex + (isLeftHalf ? 0.5 : 1))
}

const getRatingFromClientX = (
    clientX: number,
    starElements: Array<HTMLSpanElement | null>
) => {
    let closestStar: { distance: number; index: number; rect: DOMRect } | null =
        null

    for (const [index, starElement] of starElements.entries()) {
        if (!starElement) {
            continue
        }

        const rect = starElement.getBoundingClientRect()

        if (rect.width <= 0) {
            continue
        }

        if (clientX >= rect.left && clientX <= rect.right) {
            return getRatingFromStarRect(clientX, rect, index)
        }

        const distance =
            clientX < rect.left ? rect.left - clientX : clientX - rect.right

        if (!closestStar || distance < closestStar.distance) {
            closestStar = {
                distance,
                index,
                rect,
            }
        }
    }

    if (!closestStar) {
        return RATING_MIN
    }

    const clampedClientX = Math.min(
        closestStar.rect.right,
        Math.max(closestStar.rect.left, clientX)
    )

    return getRatingFromStarRect(
        clampedClientX,
        closestStar.rect,
        closestStar.index
    )
}

const getNextRating = (currentRating: number | null, delta: number) => {
    return clampRating((currentRating ?? RATING_MIN) + delta)
}

const getFillState = (value: number | null, starIndex: number) => {
    if (value === null) {
        return 'empty'
    }

    const nextValue = value - starIndex

    if (nextValue >= 1) {
        return 'full'
    }

    if (nextValue >= 0.5) {
        return 'half'
    }

    return 'empty'
}

export const ReviewRatingControl = ({
    ariaLabel,
    onChange,
    value,
}: ReviewRatingControlProps) => {
    const isDraggingRef = useRef(false)
    const starRefs = useRef<Array<HTMLSpanElement | null>>([])

    const updateRating = (clientX: number) => {
        onChange(getRatingFromClientX(clientX, starRefs.current))
    }

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        updateRating(event.clientX)
    }

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) {
            return
        }

        updateRating(event.clientX)
    }

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) {
            return
        }

        isDraggingRef.current = false

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }

        updateRating(event.clientX)
    }

    const handleLostPointerCapture = () => {
        isDraggingRef.current = false
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault()
            onChange(getNextRating(value, RATING_STEP))
            return
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault()
            onChange(getNextRating(value, -RATING_STEP))
            return
        }

        if (event.key === 'Home') {
            event.preventDefault()
            onChange(RATING_MIN)
            return
        }

        if (event.key === 'End') {
            event.preventDefault()
            onChange(RATING_MAX)
        }
    }

    return (
        <div
            aria-label={ariaLabel}
            aria-valuemax={RATING_MAX}
            aria-valuemin={RATING_MIN}
            aria-valuenow={value ?? RATING_MIN}
            aria-valuetext={value === null ? '별점 미선택' : `${value}점`}
            className={styles.ratingControl}
            onKeyDown={handleKeyDown}
            onLostPointerCapture={handleLostPointerCapture}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="slider"
            tabIndex={0}
        >
            {Array.from({ length: STAR_COUNT }, (_, index) => {
                const fillState = getFillState(value, index)
                const clipPath =
                    fillState === 'full'
                        ? 'inset(0 0 0 0)'
                        : fillState === 'half'
                          ? 'inset(0 50% 0 0)'
                          : 'inset(0 100% 0 0)'

                return (
                    <span
                        className={styles.ratingStar}
                        data-state={fillState}
                        key={index}
                        ref={element => {
                            starRefs.current[index] = element
                        }}
                    >
                        <Star
                            aria-hidden="true"
                            className={styles.ratingStarBase}
                            size={24}
                        />
                        <span
                            className={styles.ratingStarFill}
                            style={{ clipPath }}
                        >
                            <Star
                                aria-hidden="true"
                                className={styles.ratingStarFillIcon}
                                size={24}
                            />
                        </span>
                    </span>
                )
            })}
        </div>
    )
}
