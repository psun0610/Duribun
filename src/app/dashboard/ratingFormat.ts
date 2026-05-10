/** 별점 UI용: 항상 소수점 첫째 자리 (예: 5.0, 4.0) */
export const formatRatingDisplay = (rating: unknown): string => {
    if (rating == null) return '0.0'
    const n = typeof rating === 'number' ? rating : Number(rating)
    if (!Number.isFinite(n)) return '0.0'
    return n.toFixed(1)
}
