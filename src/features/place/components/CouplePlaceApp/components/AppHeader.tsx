import { Bell, Heart, LayoutGrid, List } from 'lucide-react'

import { COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'
import type { AppHeaderProps } from '../types/couplePlaceAppComponent.types'

import styles from '../CouplePlaceApp.module.scss'

export const AppHeader = ({
    activeTab,
    myName,
    onFeedView,
    onListView,
    partnerName,
    placeCount,
    viewMode,
}: AppHeaderProps) => {
    const isPlacesTab = activeTab === 'places'

    return (
        <header className={styles.appHeader}>
            <div className={styles.topNav}>
                {isPlacesTab ? (
                    <h1 className={styles.coupleTitle}>
                        {partnerName}
                        <Heart aria-hidden="true" size={13} />
                        {myName}
                    </h1>
                ) : (
                    <h1>{COUPLE_PLACE_APP_COPY.tabTitle[activeTab]}</h1>
                )}
                <button
                    aria-label={COUPLE_PLACE_APP_COPY.notification}
                    className={styles.headerIconButton}
                    type="button"
                >
                    <Bell aria-hidden="true" size={18} />
                </button>
            </div>

            {isPlacesTab ? (
                <div className={styles.placesToolbar}>
                    <span className={styles.placeCount}>
                        {placeCount}
                        {COUPLE_PLACE_APP_COPY.recordSuffix}
                    </span>
                    <div
                        aria-label={COUPLE_PLACE_APP_COPY.viewModeLabel}
                        className={styles.viewToggle}
                        role="group"
                    >
                        <button
                            aria-label={COUPLE_PLACE_APP_COPY.feedView}
                            aria-pressed={viewMode === 'feed'}
                            className={
                                viewMode === 'feed'
                                    ? styles.viewToggleButtonActive
                                    : styles.viewToggleButton
                            }
                            onClick={onFeedView}
                            type="button"
                        >
                            <LayoutGrid aria-hidden="true" size={14} />
                        </button>
                        <button
                            aria-label={COUPLE_PLACE_APP_COPY.listView}
                            aria-pressed={viewMode === 'list'}
                            className={
                                viewMode === 'list'
                                    ? styles.viewToggleButtonActive
                                    : styles.viewToggleButton
                            }
                            onClick={onListView}
                            type="button"
                        >
                            <List aria-hidden="true" size={14} />
                        </button>
                    </div>
                </div>
            ) : null}
        </header>
    )
}
