import { LayoutGrid, List } from 'lucide-react'

import { SegmentedControl } from '@/components/ui'

import { COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'
import type { AppHeaderProps } from '../types/couplePlaceAppComponent.types'

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
        <div className="mb-5 flex items-center justify-between gap-3">
            <div>
                <p className="text-[12px] font-medium tracking-widest text-muted-foreground uppercase">
                    {COUPLE_PLACE_APP_COPY.appTitle}
                </p>
                <h1 className="mt-0.5 text-[1.375rem] font-semibold leading-tight text-foreground">
                    {coupleName}
                </h1>
            </div>
            <SegmentedControl
                ariaLabel={COUPLE_PLACE_APP_COPY.viewModeLabel}
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
        </div>
    )
}
