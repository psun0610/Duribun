import { MapPin } from 'lucide-react'

import type { KakaoPlaceResultCardProps } from '../types/placeRegistrationPanel.types'

import styles from '../PlaceRegistrationPanel.module.scss'

export const KakaoPlaceResultRow = ({
    isSelected,
    onSelect,
    place,
}: KakaoPlaceResultCardProps) => {
    return (
        <button
            className={`${styles.resultRow} ${
                isSelected ? styles.selectedResultRow : ''
            }`}
            onClick={() => onSelect(place)}
            type="button"
        >
            <span className={styles.resultIcon}>
                <MapPin aria-hidden="true" size={17} />
            </span>
            <span className={styles.resultBody}>
                <strong>{place.name}</strong>
                <span>
                    {place.roadAddress ||
                        place.address ||
                        place.providerCategoryName}
                </span>
            </span>
        </button>
    )
}
