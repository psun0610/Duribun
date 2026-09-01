import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'
import type { CouplePlaceReviewDetail } from '@/features/review/types/reviewDetail.types'

export const CURRENT_USER_ID = 'user-me'

export const PREVIEW_PLACES: CouplePlaceListItem[] = [
    {
        address: '부산 해운대구 우동',
        category: 'cafe',
        couplePlaceId: 'cp-1',
        isExploreApproved: true,
        isPublic: true,
        name: '오션뷰 브런치 카페',
        provider: 'kakao',
        providerCategoryName: '카페',
        roadAddress: '부산 해운대구 해운대해변로 264',
    },
    {
        address: '경기 남양주시',
        category: 'activity',
        couplePlaceId: 'cp-2',
        isExploreApproved: false,
        isPublic: false,
        name: '숲속 산책길',
        provider: 'kakao',
        providerCategoryName: '공원',
        roadAddress: '경기 남양주시 화도읍',
    },
    {
        address: '서울 마포구 연남동',
        category: 'restaurant',
        couplePlaceId: 'cp-3',
        isExploreApproved: false,
        isPublic: false,
        name: '노을 맛집 루프탑',
        provider: 'kakao',
        providerCategoryName: '양식',
        roadAddress: '서울 마포구 성미산로',
    },
    {
        address: '서울 종로구',
        category: 'cafe',
        couplePlaceId: 'cp-4',
        isExploreApproved: false,
        isPublic: false,
        name: '감성 독립서점',
        provider: 'manual',
        providerCategoryName: '',
        roadAddress: '',
    },
    {
        address: '서울 성동구 성수동',
        category: 'restaurant',
        couplePlaceId: 'cp-5',
        isExploreApproved: false,
        isPublic: false,
        name: '성수동 파스타집',
        provider: 'kakao',
        providerCategoryName: '양식',
        roadAddress: '서울 성동구 연무장길',
    },
    {
        address: '제주 서귀포시',
        category: 'activity',
        couplePlaceId: 'cp-6',
        isExploreApproved: false,
        isPublic: false,
        name: '협재 해변 산책',
        provider: 'kakao',
        providerCategoryName: '해수욕장',
        roadAddress: '제주 제주시 한림읍',
    },
]

export const PREVIEW_REVIEW_DETAIL: CouplePlaceReviewDetail = {
    averageRating: 4.5,
    couplePlaceId: 'cp-1',
    reviewCount: 2,
    reviewStatus: 'complete',
    reviews: [
        {
            authorId: CURRENT_USER_ID,
            id: 'review-me',
            oneLineReview: '창가 자리가 최고. 햇살이 너무 예뻤던 날',
            photos: [],
            rating: 4.4,
            ratings: [
                { key: 'coffee', label: '커피맛', score: 5 },
                { key: 'dessert', label: '디저트', score: 4 },
                { key: 'mood', label: '분위기', score: 5 },
                { key: 'seat_comfort', label: '좌석편의', score: 3.5 },
                { key: 'satisfaction', label: '만족도', score: 4.5 },
            ],
            tags: ['분위기', '뷰'],
        },
        {
            authorId: 'user-partner',
            id: 'review-partner',
            oneLineReview: '파스타가 생각보다 훨씬 맛있었어. 또 가자',
            photos: [],
            rating: 4.6,
            ratings: [
                { key: 'coffee', label: '커피맛', score: 4.5 },
                { key: 'mood', label: '분위기', score: 5 },
            ],
            tags: ['맛', '사진 명소'],
        },
    ],
}

export const PREVIEW_REVIEW_DETAILS_BY_PLACE_ID: Record<
    string,
    CouplePlaceReviewDetail
> = {
    'cp-1': PREVIEW_REVIEW_DETAIL,
    'cp-2': {
        averageRating: 4.7,
        couplePlaceId: 'cp-2',
        reviewCount: 1,
        reviewStatus: 'partner-waiting',
        reviews: [
            {
                authorId: 'user-partner',
                id: 'review-2',
                oneLineReview: '공기가 진짜 좋았어',
                photos: [],
                rating: 4.7,
                ratings: [],
                tags: ['분위기', '사진 명소'],
            },
        ],
    },
    'cp-3': {
        averageRating: 4.8,
        couplePlaceId: 'cp-3',
        reviewCount: 1,
        reviewStatus: 'waiting-partner',
        reviews: [
            {
                authorId: CURRENT_USER_ID,
                id: 'review-3',
                oneLineReview: '노을이 미쳤다',
                photos: [],
                rating: 4.8,
                ratings: [],
                tags: ['뷰', '데이트 추천'],
            },
        ],
    },
    'cp-5': {
        averageRating: 4.2,
        couplePlaceId: 'cp-5',
        reviewCount: 2,
        reviewStatus: 'complete',
        reviews: [
            {
                authorId: CURRENT_USER_ID,
                id: 'review-5',
                oneLineReview: '면이 쫄깃했어',
                photos: [],
                rating: 4.2,
                ratings: [],
                tags: ['맛'],
            },
        ],
    },
}
