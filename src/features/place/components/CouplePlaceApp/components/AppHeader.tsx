import { Bell, LayoutGrid, List } from 'lucide-react'

import { SegmentedControl } from '@/components/ui'

import { COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'
import type { AppHeaderProps } from '../types/couplePlaceAppComponent.types'

import styles from '../CouplePlaceApp.module.scss'

export const AppHeader = ({
    activeTab,
    onFeedView,
    onListView,
    viewMode,
}: AppHeaderProps) => {
    const handleViewChange = (nextView: string) => {
        if (nextView === 'feed') {
            onFeedView()
            return
        }

        onListView()
    }

    const title = COUPLE_PLACE_APP_COPY.tabTitle[activeTab]

    return (
        <header className={styles.appHeader}>
            {activeTab === 'places' ? null : (
                <div className={styles.topNav}>
                    <h1>{title}</h1>
                    <button
                        aria-label={COUPLE_PLACE_APP_COPY.notification}
                        className={styles.headerIconButton}
                        type="button"
                    >
                        <Bell aria-hidden="true" size={18} />
                    </button>
                </div>
            )}

            {activeTab === 'places' ? (
                <SegmentedControl
                    ariaLabel={COUPLE_PLACE_APP_COPY.viewModeLabel}
                    className={styles.viewSwitch}
                    onChange={handleViewChange}
                    options={[
                        {
                            icon: <LayoutGrid aria-hidden="true" size={14} />,
                            label: COUPLE_PLACE_APP_COPY.feedViewShort,
                            value: 'feed',
                        },
                        {
                            icon: <List aria-hidden="true" size={14} />,
                            label: COUPLE_PLACE_APP_COPY.listViewShort,
                            value: 'list',
                        },
                    ]}
                    value={viewMode}
                />
            ) : null}
        </header>
    )
}
