'use client'

import { useEffect, RefObject } from 'react'

/** Radix 포털로 열린 UI(드롭다운·알럿) 클릭 시 바깥으로 간주하지 않음 */
function isInsideIgnoredPortal(target: Node): boolean {
    if (!(target instanceof Element)) return false
    return !!(
        target.closest('[data-slot="dropdown-menu-content"]') ||
        target.closest('[data-slot="alert-dialog-overlay"]') ||
        target.closest('[data-slot="alert-dialog-content"]')
    )
}

export const useClickOutside = (
    ref: RefObject<HTMLElement | null>,
    handler: () => void,
    /** 모달 안에서 드롭다운·AlertDialog 포털을 쓸 때 true */
    ignorePortals?: boolean,
) => {
    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            const target = e.target as Node | null
            if (!target) return
            if (ignorePortals && isInsideIgnoredPortal(target)) return
            if (ref.current && !ref.current.contains(target)) {
                handler()
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [ref, handler, ignorePortals])
}
