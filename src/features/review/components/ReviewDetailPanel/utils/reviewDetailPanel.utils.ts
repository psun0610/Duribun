export const formatRating = (rating: number) => {
    const rounded = Math.round(rating * 10) / 10

    return Number.isInteger(rounded) ? `${rounded.toFixed(0)}.0` : `${rounded}`
}
