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
    // 우리 장소 탭에서만 씁니다. 다른 탭은 제목이 탭 이름이라 필요 없습니다.
    myName?: string
    partnerName?: string
    placeCount?: number
}

export const CouplePlaceApp = ({
    activeTab,
    children,
    myName = '',
    partnerName = '',
    placeCount = 0,
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
                    myName={myName}
                    onFeedView={handleFeedView}
                    onListView={handleListView}
                    partnerName={partnerName}
                    placeCount={placeCount}
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
