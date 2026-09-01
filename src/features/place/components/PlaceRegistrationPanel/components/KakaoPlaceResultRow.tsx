import { Check, MapPin } from 'lucide-react'

import type { KakaoPlaceResultCardProps } from '../types/placeRegistrationPanel.types'

import styles from '../PlaceRegistrationPanel.module.scss'

export const KakaoPlaceResultRow = ({
    isSelected,
    onSelect,
    place,
}: KakaoPlaceResultCardProps) => {
    return (
        <button
            aria-pressed={isSelected}
            className={`${styles.resultRow} ${
                isSelected ? styles.selectedResultRow : ''
            }`}
            onClick={() => onSelect(place)}
            type="button"
        >
            <span className={styles.resultThumb}>
                <MapPin aria-hidden="true" size={19} />
            </span>
            <span className={styles.resultBody}>
                <strong>{place.name}</strong>
                <span>
                    {place.providerCategoryName
                        ? `${place.providerCategoryName} · `
                        : ''}
                    {place.roadAddress || place.address}
                </span>
            </span>
            <span className={styles.resultCheck}>
                {isSelected ? (
                    <Check aria-hidden="true" size={15} strokeWidth={3} />
                ) : null}
            </span>
        </button>
    )
}
