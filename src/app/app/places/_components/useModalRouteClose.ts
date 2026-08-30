'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 모달 라우트(/app/places/new, .../review 등)의 닫기 핸들러입니다.
 * 목록에서 열었다면 뒤로 가고, 딥링크로 바로 들어왔다면 뒤로가기가
 * 앱 밖으로 나가버리므로 장소 목록으로 대체 이동합니다.
 */
export const useModalRouteClose = (fallbackHref: string) => {
    const router = useRouter()

    return useCallback(() => {
        const cameFromInside =
            window.history.length > 1 &&
            document.referrer.startsWith(window.location.origin)

        if (cameFromInside) {
            router.back()
            return
        }

        router.replace(fallbackHref)
    }, [fallbackHref, router])
}
