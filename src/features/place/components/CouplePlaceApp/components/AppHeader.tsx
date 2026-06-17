import { LayoutGrid, List } from 'lucide-react'

import { COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'
import type { AppHeaderProps } from '../types/couplePlaceAppComponent.types'

export const AppHeader = ({
    coupleName,
    onFeedView,
    onListView,
    viewMode,
}: AppHeaderProps) => {
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
            <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                <button
                    aria-label={COUPLE_PLACE_APP_COPY.feedView}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                        viewMode === 'feed'
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-muted-foreground'
                    }`}
                    onClick={onFeedView}
                    type="button"
                >
                    <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                    aria-label={COUPLE_PLACE_APP_COPY.listView}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                        viewMode === 'list'
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-muted-foreground'
                    }`}
                    onClick={onListView}
                    type="button"
                >
                    <List className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}
