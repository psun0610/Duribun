'use client'

import { useState } from 'react'

import type { ReviewTargetPlace } from '@/features/review/types/reviewSubmission.types'

import type {
    ActiveTab,
    ReviewDetailTargetPlace,
    ViewMode,
} from '../types/couplePlaceApp.types'

export const useCouplePlaceApp = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('feed')
    const [activeTab, setActiveTab] = useState<ActiveTab>('places')
    const [isRegistrationPanelOpen, setIsRegistrationPanelOpen] =
        useState(false)
    const [reviewTargetPlace, setReviewTargetPlace] =
        useState<ReviewTargetPlace | null>(null)
    const [reviewDetailTargetPlace, setReviewDetailTargetPlace] =
        useState<ReviewDetailTargetPlace | null>(null)

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
        setReviewTargetPlace(null)
        setReviewDetailTargetPlace(null)
        setIsRegistrationPanelOpen(true)
    }

    const handleCloseRegistrationPanel = () => {
        setIsRegistrationPanelOpen(false)
    }

    const handleOpenReviewWriter = (place: ReviewTargetPlace) => {
        setActiveTab('places')
        setReviewDetailTargetPlace(null)
        setIsRegistrationPanelOpen(false)
        setReviewTargetPlace(place)
    }

    const handleCloseReviewWriter = () => {
        setReviewTargetPlace(null)
    }

    const handleOpenReviewDetail = (place: ReviewDetailTargetPlace) => {
        setActiveTab('places')
        setIsRegistrationPanelOpen(false)
        setReviewTargetPlace(null)
        setReviewDetailTargetPlace(place)
    }

    const handleCloseReviewDetail = () => {
        setReviewDetailTargetPlace(null)
    }

    return {
        activeTab,
        handleCloseRegistrationPanel,
        handleCloseReviewDetail,
        handleCloseReviewWriter,
        handleFeedView,
        handleListView,
        handleOpenRegistrationPanel,
        handleOpenReviewDetail,
        handleOpenReviewWriter,
        handleTabChange,
        isRegistrationPanelOpen,
        reviewDetailTargetPlace,
        reviewTargetPlace,
        viewMode,
    }
}
