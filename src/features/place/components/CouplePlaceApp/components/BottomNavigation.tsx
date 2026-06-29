import { Plus } from 'lucide-react'

import { COUPLE_PLACE_APP_COPY, TAB_ITEMS } from '../const/couplePlaceApp.const'
import type { BottomNavigationProps } from '../types/couplePlaceAppComponent.types'

import styles from '../CouplePlaceApp.module.scss'

const renderTabItems = ({
    activeTab,
    items,
    onTabChange,
}: {
    activeTab: BottomNavigationProps['activeTab']
    items: typeof TAB_ITEMS
    onTabChange: BottomNavigationProps['onTabChange']
}) => {
    return items.map(item => {
        const Icon = item.icon
        const isActive = activeTab === item.value

        return (
            <button
                className={`${styles.navItem} ${
                    isActive ? styles.navItemActive : ''
                }`}
                key={item.value}
                onClick={() => onTabChange(item.value)}
                type="button"
            >
                <Icon
                    aria-hidden="true"
                    strokeWidth={isActive ? 2.5 : 2}
                />
                <span>{item.label}</span>
            </button>
        )
    })
}

export const BottomNavigation = ({
    activeTab,
    onAddPlace,
    onTabChange,
}: BottomNavigationProps) => {
    return (
        <nav className={styles.bottomNav}>
            <div className={styles.bottomNavInner}>
                {renderTabItems({
                    activeTab,
                    items: TAB_ITEMS.slice(0, 2),
                    onTabChange,
                })}

                <button
                    aria-label={COUPLE_PLACE_APP_COPY.addPlace}
                    className={styles.centerAction}
                    onClick={onAddPlace}
                    type="button"
                >
                    <Plus aria-hidden="true" strokeWidth={3} />
                </button>

                {renderTabItems({
                    activeTab,
                    items: TAB_ITEMS.slice(2),
                    onTabChange,
                })}
            </div>
        </nav>
    )
}
