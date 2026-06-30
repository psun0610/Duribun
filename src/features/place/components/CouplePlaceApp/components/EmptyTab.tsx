import { EmptyState } from '@/components/ui'

import type { EmptyTabProps } from '../types/couplePlaceAppComponent.types'

export const EmptyTab = ({ description, icon: Icon, title }: EmptyTabProps) => {
    return (
        <EmptyState
            description={description}
            icon={<Icon strokeWidth={2.5} />}
            title={title}
        />
    )
}
