import Link from 'next/link'
import { Plus } from 'lucide-react'

import { COUPLE_PLACE_APP_COPY, TAB_ITEMS } from '../const/couplePlaceApp.const'
import type { BottomNavigationProps } from '../types/couplePlaceAppComponent.types'

import styles from '../CouplePlaceApp.module.scss'

const renderTabItems = ({
    activeTab,
    items,
    tabHrefs,
}: {
    activeTab: BottomNavigationProps['activeTab']
    items: typeof TAB_ITEMS
    tabHrefs: BottomNavigationProps['tabHrefs']
}) => {
    return items.map(item => {
        const Icon = item.icon
        const isActive = activeTab === item.value

        return (
            <Link
                aria-current={isActive ? 'page' : undefined}
                className={`${styles.navItem} ${
                    isActive ? styles.navItemActive : ''
                }`}
                href={tabHrefs[item.value]}
                key={item.value}
            >
                <Icon
                    aria-hidden="true"
                    strokeWidth={isActive ? 2.5 : 2}
                />
                <span>{item.label}</span>
            </Link>
        )
    })
}

export const BottomNavigation = ({
    activeTab,
    addPlaceHref,
    tabHrefs,
}: BottomNavigationProps) => {
    return (
        <nav className={styles.bottomNav}>
            <div className={styles.bottomNavInner}>
                {renderTabItems({
                    activeTab,
                    items: TAB_ITEMS.slice(0, 2),
                    tabHrefs,
                })}

                <Link
                    aria-label={COUPLE_PLACE_APP_COPY.addPlace}
                    className={styles.centerAction}
                    href={addPlaceHref}
                >
                    <Plus aria-hidden="true" strokeWidth={3} />
                </Link>

                {renderTabItems({
                    activeTab,
                    items: TAB_ITEMS.slice(2),
                    tabHrefs,
                })}
            </div>
        </nav>
    )
}
