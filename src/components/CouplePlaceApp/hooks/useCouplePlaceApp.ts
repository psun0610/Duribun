'use client'

import { useState } from 'react'

import type { ActiveTab, ViewMode } from '../types/couplePlaceApp.types'

export const useCouplePlaceApp = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('feed')
    const [activeTab, setActiveTab] = useState<ActiveTab>('places')
    const [isRegistrationPanelOpen, setIsRegistrationPanelOpen] =
        useState(false)

    const handleFeedView = () => {
        setViewMode('feed')
    }

    const handleListView = () => {
        setViewMode('list')
    }

    const handleTabChange = (nextTab: ActiveTab) => {
        setActiveTab(nextTab)
    }

    const handleOpenRegistrationPanel = () => {
        setActiveTab('places')
        setIsRegistrationPanelOpen(true)
    }

    const handleCloseRegistrationPanel = () => {
        setIsRegistrationPanelOpen(false)
    }

    return {
        activeTab,
        handleCloseRegistrationPanel,
        handleFeedView,
        handleListView,
        handleOpenRegistrationPanel,
        handleTabChange,
        isRegistrationPanelOpen,
        viewMode,
    }
}
