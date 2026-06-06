'use client'

import { useState } from 'react'

import type { ActiveTab, ViewMode } from '../types/couplePlaceApp.types'

export const useCouplePlaceApp = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('feed')
    const [activeTab, setActiveTab] = useState<ActiveTab>('places')

    const handleFeedView = () => {
        setViewMode('feed')
    }

    const handleListView = () => {
        setViewMode('list')
    }

    const handleTabChange = (nextTab: ActiveTab) => {
        setActiveTab(nextTab)
    }

    return {
        activeTab,
        handleFeedView,
        handleListView,
        handleTabChange,
        viewMode,
    }
}
