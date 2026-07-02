'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

import { AppHeader } from './components/AppHeader'
import { BottomNavigation } from './components/BottomNavigation'
import type { CouplePlaceAppProps } from './types/couplePlaceApp.types'
import { getAppAddPlaceHref, getAppPlacesHref, getAppTabHref } from './utils/couplePlaceRoute.utils'

import styles from './CouplePlaceApp.module.scss'

type CouplePlaceAppShellProps = Pick<
    CouplePlaceAppProps,
    'activeTab' | 'viewMode'
> & {
    children: ReactNode
}

export const CouplePlaceApp = ({
    activeTab,
    children,
    viewMode,
}: CouplePlaceAppShellProps) => {
    const router = useRouter()

    const handleFeedView = () => {
        router.replace(getAppPlacesHref('feed'))
    }

    const handleListView = () => {
        router.replace(getAppPlacesHref('list'))
    }

    return (
        <main className={styles.app}>
            <section className={styles.content}>
                <AppHeader
                    activeTab={activeTab}
                    onFeedView={handleFeedView}
                    onListView={handleListView}
                    viewMode={viewMode}
                />
                {children}
            </section>

            <BottomNavigation
                activeTab={activeTab}
                addPlaceHref={getAppAddPlaceHref(viewMode)}
                tabHrefs={{
                    explore: getAppTabHref('explore'),
                    friends: getAppTabHref('friends'),
                    places: getAppPlacesHref(viewMode),
                    settings: getAppTabHref('settings'),
                }}
            />
        </main>
    )
}
