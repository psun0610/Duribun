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
                className="flex flex-col items-center gap-1 rounded-2xl px-5 py-2.5"
                key={item.value}
                onClick={() => onTabChange(item.value)}
                type="button"
            >
                <Icon
                    className={`h-6 w-6 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                    className={`text-xs font-semibold ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                    {item.label}
                </span>
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
        <nav className="sticky bottom-0 border-t-2 border-border bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
            <div
                className={`${styles.bottomNav} mx-auto flex max-w-2xl items-center justify-around px-4 pt-2`}
            >
                {renderTabItems({
                    activeTab,
                    items: TAB_ITEMS.slice(0, 2),
                    onTabChange,
                })}

                <button
                    aria-label={COUPLE_PLACE_APP_COPY.addPlace}
                    className={`${styles.centerAction} -mt-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary to-secondary text-white transition active:scale-95`}
                    onClick={onAddPlace}
                    type="button"
                >
                    <Plus className="h-7 w-7" strokeWidth={3} />
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
