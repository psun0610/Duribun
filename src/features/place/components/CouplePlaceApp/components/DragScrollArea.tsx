'use client'

import { useRef, type MouseEvent, type PointerEvent } from 'react'

import type { DragScrollAreaProps } from '../types/couplePlaceAppComponent.types'

interface DragState {
    pointerId: number
    scrollLeft: number
    scrollTop: number
    startX: number
    startY: number
}

export const DragScrollArea = ({
    axis,
    children,
    className,
    label,
    shouldStopPropagation = false,
}: DragScrollAreaProps) => {
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const dragStateRef = useRef<DragState | null>(null)
    const isDraggingRef = useRef(false)

    const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
        dragStateRef.current = null

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
    }

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (shouldStopPropagation) {
            event.stopPropagation()
        }

        if (event.button !== 0 || !scrollRef.current) {
            return
        }

        dragStateRef.current = {
            pointerId: event.pointerId,
            scrollLeft: scrollRef.current.scrollLeft,
            scrollTop: scrollRef.current.scrollTop,
            startX: event.clientX,
            startY: event.clientY,
        }
        isDraggingRef.current = false
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const element = scrollRef.current
        const dragState = dragStateRef.current

        if (!element || !dragState || dragState.pointerId !== event.pointerId) {
            return
        }

        const deltaX = event.clientX - dragState.startX
        const deltaY = event.clientY - dragState.startY

        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
            isDraggingRef.current = true
        }

        if (axis === 'x') {
            element.scrollLeft = dragState.scrollLeft - deltaX
        } else {
            element.scrollTop = dragState.scrollTop - deltaY
        }
    }

    const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) {
            return
        }

        event.preventDefault()
        event.stopPropagation()
        isDraggingRef.current = false
    }

    return (
        <div
            aria-label={label}
            className={className}
            onClickCapture={handleClickCapture}
            onPointerCancel={finishDrag}
            onPointerDown={handlePointerDown}
            onPointerLeave={finishDrag}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            ref={scrollRef}
        >
            {children}
        </div>
    )
}
