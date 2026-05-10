'use client'

import { useEffect, RefObject } from 'react'

export const useClickOutside = (
    ref: RefObject<HTMLElement | null>,
    handler: () => void,
) => {
    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                handler()
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [ref, handler])
}
