import Link from 'next/link'
import { Heart, House, Plus } from 'lucide-react'

import { COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'

import styles from '../CouplePlaceApp.module.scss'

interface PlacesEmptyStateProps {
    addPlaceHref: string
}

/**
 * 담은 곳이 하나도 없을 때만 보이는 화면입니다.
 * 예시 장소를 채워 넣으면 진짜 기록처럼 보여서, 대신 첫 걸음만 안내합니다.
 */
export const PlacesEmptyState = ({ addPlaceHref }: PlacesEmptyStateProps) => {
    return (
        <div className={styles.placesEmpty}>
            <div className={styles.placesEmptyArt}>
                <House aria-hidden="true" size={58} strokeWidth={1.5} />
                <span className={styles.placesEmptyBadge}>
                    <Heart aria-hidden="true" size={17} />
                </span>
            </div>

            <p className={styles.placesEmptyTitle}>
                {COUPLE_PLACE_APP_COPY.placesEmptyTitle}
            </p>
            <p className={styles.placesEmptyDescription}>
                {COUPLE_PLACE_APP_COPY.placesEmptyDescription}
            </p>

            <Link className={styles.placesEmptyAction} href={addPlaceHref}>
                <Plus aria-hidden="true" size={18} strokeWidth={2.8} />
                {COUPLE_PLACE_APP_COPY.placesEmptyAction}
            </Link>
        </div>
    )
}
