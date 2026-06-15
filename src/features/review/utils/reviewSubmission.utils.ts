import type { ReviewCategory, ReviewPhotoInput } from '../types/reviewSubmission.types'

export const normalizeReviewText = (value: FormDataEntryValue | null) => {
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim()
}

export const normalizeReviewCategory = (value: FormDataEntryValue | null): ReviewCategory => {
    const normalizedValue = normalizeReviewText(value)

    if (normalizedValue === 'restaurant') {
        return normalizedValue
    }

    if (normalizedValue === 'cafe') {
        return normalizedValue
    }

    return 'activity'
}

export const getFileExtension = (file: File) => {
    const nameExtension = file.name.split('.').pop()?.toLowerCase()

    if (nameExtension) {
        return nameExtension
    }

    return file.type.split('/').pop() || 'jpg'
}

export const buildReviewPhotoInputs = (
    files: FormDataEntryValue[],
    kinds: FormDataEntryValue[]
) => {
    const photoInputs: ReviewPhotoInput[] = []

    for (let index = 0; index < files.length; index += 1) {
        const file = files[index]
        const kind = kinds[index]

        if (!(file instanceof File) || file.size === 0) {
            continue
        }

        const normalizedKind = normalizeReviewText(kind)

        if (
            normalizedKind !== 'place_food' &&
            normalizedKind !== 'couple_private'
        ) {
            continue
        }

        photoInputs.push({
            file,
            kind: normalizedKind,
        })
    }

    return photoInputs
}
