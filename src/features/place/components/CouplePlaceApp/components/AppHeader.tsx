import { LayoutGrid, List } from 'lucide-react'

import { SegmentedControl } from '@/components/ui'

import { COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'
import type { AppHeaderProps } from '../types/couplePlaceAppComponent.types'

import styles from '../CouplePlaceApp.module.scss'

export const AppHeader = ({
    coupleName,
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

    return (
        <header className={styles.appHeader}>
            <h1>{COUPLE_PLACE_APP_COPY.placesTitle}</h1>
            <p>{coupleName}</p>
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
        </header>
    )
}
