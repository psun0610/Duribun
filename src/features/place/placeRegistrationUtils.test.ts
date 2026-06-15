import { describe, expect, it } from 'vitest'

import { mapKakaoPlaceDocument } from './utils/placeRegistration.utils'

describe('place registration utils', () => {
    it('filters gas stations from Kakao place search results', () => {
        const result = mapKakaoPlaceDocument({
            address_name: '서울 강남구',
            category_group_code: 'OL7',
            category_group_name: '주유소,충전소',
            category_name: '교통,수송 > 자동차 > 주유소',
            id: 'gas-station',
            place_name: '두리번주유소',
        })

        expect(result).toBeNull()
    })

    it('keeps date-place categories from Kakao place search results', () => {
        const result = mapKakaoPlaceDocument({
            address_name: '서울 마포구',
            category_group_code: 'CE7',
            category_group_name: '카페',
            category_name: '음식점 > 카페',
            id: 'cafe',
            place_name: '두리번카페',
        })

        expect(result?.category).toBe('cafe')
        expect(result?.name).toBe('두리번카페')
    })
})
