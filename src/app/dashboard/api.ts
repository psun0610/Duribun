import { apiCall } from '@/lib/supabase/client'
import { Place } from './types'

export const fetchPlaces = async (): Promise<Place[]> => {
    const response = (await apiCall('/places/list')) as { places?: Place[] }
    return response.places ?? []
}

export const addPlace = async (data: {
    name: string
    address: string
    category: string
}): Promise<void> => {
    await apiCall('/places', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export const deletePlace = async (placeId: string): Promise<void> => {
    await apiCall(`/places/${placeId}`, { method: 'DELETE' })
}

export const addReview = async (data: {
    placeId: string
    ratings: Record<string, number>
    revisit: boolean
    comment: string
    rating: number
    images: string[]
}): Promise<void> => {
    await apiCall('/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}
