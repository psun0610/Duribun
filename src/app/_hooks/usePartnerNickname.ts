'use client'

import { useQueryClient } from '@tanstack/react-query'
import { COUPLE_STATUS_QUERY_KEY, type CoupleStatusResponse } from './useAppInit'

/**
 * TanStack Query 캐시에서 파트너 닉네임을 읽어옵니다.
 * useAppInit이 이미 /couple/status를 fetch한 뒤이므로 추가 네트워크 요청 없이 동작합니다.
 */
export const usePartnerNickname = (): string => {
    const queryClient = useQueryClient()
    const data = queryClient.getQueryData<CoupleStatusResponse>(
        COUPLE_STATUS_QUERY_KEY,
    )
    return data?.partnerNickname ?? '상대'
}
