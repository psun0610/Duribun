'use client'

import { useState } from 'react'

import type { ReviewTargetPlace } from '@/features/review/types/reviewSubmission.types'

import type { ActiveTab, ViewMode } from '../types/couplePlaceApp.types'

export const useCouplePlaceApp = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('feed')
    const [activeTab, setActiveTab] = useState<ActiveTab>('places')
    const [isRegistrationPanelOpen, setIsRegistrationPanelOpen] =
        useState(false)
    const [reviewTargetPlace, setReviewTargetPlace] =
        useState<ReviewTargetPlace | null>(null)

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

    const handleOpenReviewWriter = (place: ReviewTargetPlace) => {
        setActiveTab('places')
        setReviewTargetPlace(place)
    }

    const handleCloseReviewWriter = () => {
        setReviewTargetPlace(null)
    }

    return {
        activeTab,
        handleCloseRegistrationPanel,
        handleCloseReviewWriter,
        handleFeedView,
        handleListView,
        handleOpenRegistrationPanel,
        handleOpenReviewWriter,
        handleTabChange,
        isRegistrationPanelOpen,
        reviewTargetPlace,
        viewMode,
    }
}
