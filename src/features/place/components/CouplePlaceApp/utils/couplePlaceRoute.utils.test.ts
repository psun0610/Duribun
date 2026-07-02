import { describe, expect, it } from 'vitest'

import {
    getAppAddPlaceHref,
    getAppPlacesHref,
    getAppReviewDetailHref,
    getAppReviewWriterHref,
    getAppTabHref,
    parseAppViewMode,
} from './couplePlaceRoute.utils'

describe('couple place route utils', () => {
    it('builds tab routes', () => {
        expect(getAppTabHref('friends')).toBe('/app/friends')
        expect(getAppTabHref('explore')).toBe('/app/explore')
    })

    it('keeps the places tab view route stable', () => {
        expect(getAppPlacesHref()).toBe('/app/places')
        expect(getAppPlacesHref('list')).toBe('/app/places?view=list')
    })

    it('builds overlay routes with the current view preserved', () => {
        expect(getAppAddPlaceHref('list')).toBe('/app/places/new?view=list')
        expect(getAppReviewWriterHref('place-1', 'list')).toBe(
            '/app/places/place-1/review/new?view=list'
        )
        expect(getAppReviewDetailHref('place-1')).toBe(
            '/app/places/place-1/review'
        )
    })

    it('normalizes the places view mode', () => {
        expect(parseAppViewMode('list')).toBe('list')
        expect(parseAppViewMode('feed')).toBe('feed')
        expect(parseAppViewMode(undefined)).toBe('feed')
    })
})
