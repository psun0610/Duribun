'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deletePlace } from '../api'
import { PLACES_QUERY_KEY } from './usePlaces'

export const useDeletePlace = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (placeId: string) => deletePlace(placeId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PLACES_QUERY_KEY })
            toast.success('장소가 삭제되었습니다')
        },
        onError: () => {
            toast.error('장소 삭제에 실패했습니다')
        },
    })
}
