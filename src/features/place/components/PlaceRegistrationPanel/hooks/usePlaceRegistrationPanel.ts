'use client'

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FocusEvent,
} from 'react'

import type { KakaoPlaceSearchResult } from '@/features/place/types/placeRegistration.types'

import type { UsePlaceRegistrationPanelParams } from '../types/placeRegistrationPanel.types'
import { MODAL_CLOSE_ANIMATION_MS } from '../const/placeRegistrationPanel.const'

const CONTENT_FADE_MS = 280
const COLLAPSED_SEARCH_OFFSET_RATIO = 0.35
const SEARCH_DEBOUNCE_MS = 350

export const usePlaceRegistrationPanel = ({
    onClose,
    hasKakaoRegistrationSucceeded,
    hasManualRegistrationSucceeded,
}: UsePlaceRegistrationPanelParams) => {
    const sheetRef = useRef<HTMLDivElement>(null)
    const sheetBodyRef = useRef<HTMLDivElement>(null)
    const searchFormRef = useRef<HTMLFormElement>(null)
    const searchSectionRef = useRef<HTMLDivElement>(null)
    const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [selectedPlace, setSelectedPlace] =
        useState<KakaoPlaceSearchResult | null>(null)
    const [isManualFormOpen, setIsManualFormOpen] = useState(false)
    const [isSearchExpanded, setIsSearchExpanded] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [isContentVisible, setIsContentVisible] = useState(false)
    const [searchOffset, setSearchOffset] = useState(0)

    const handleClosePanel = useCallback(() => {
        if (closeTimerRef.current) {
            return
        }

        setIsClosing(true)
        closeTimerRef.current = setTimeout(() => {
            closeTimerRef.current = null
            onClose()
        }, MODAL_CLOSE_ANIMATION_MS)
    }, [onClose])

    const updateSearchOffset = useCallback(() => {
        const body = sheetBodyRef.current
        const search = searchSectionRef.current

        if (!body || !search) {
            return
        }

        const offset = Math.max(
            0,
            (body.clientHeight - search.offsetHeight) *
                COLLAPSED_SEARCH_OFFSET_RATIO
        )
        setSearchOffset(offset)
    }, [])

    useLayoutEffect(() => {
        updateSearchOffset()

        const body = sheetBodyRef.current

        if (!body) {
            return
        }

        const observer = new ResizeObserver(updateSearchOffset)
        observer.observe(body)

        return () => observer.disconnect()
    }, [updateSearchOffset])

    useEffect(() => {
        if (hasKakaoRegistrationSucceeded || hasManualRegistrationSucceeded) {
            handleClosePanel()
        }
    }, [
        handleClosePanel,
        hasKakaoRegistrationSucceeded,
        hasManualRegistrationSucceeded,
    ])

    useEffect(() => {
        return () => {
            if (collapseTimerRef.current) {
                clearTimeout(collapseTimerRef.current)
            }

            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
            }

            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current)
            }
        }
    }, [])

    const clearCollapseTimer = () => {
        if (collapseTimerRef.current) {
            clearTimeout(collapseTimerRef.current)
            collapseTimerRef.current = null
        }
    }

    const expandSearch = () => {
        clearCollapseTimer()
        setIsSearchExpanded(true)
        requestAnimationFrame(() => {
            setIsContentVisible(true)
        })
    }

    const collapseSearch = () => {
        clearCollapseTimer()
        setIsContentVisible(false)
        collapseTimerRef.current = setTimeout(() => {
            setIsSearchExpanded(false)
            collapseTimerRef.current = null
        }, CONTENT_FADE_MS)
    }

    const handleSelectPlace = (place: KakaoPlaceSearchResult) => {
        setSelectedPlace(place)
    }

    const handleClearSelectedPlace = () => {
        setSelectedPlace(null)
    }

    const handleOpenManualForm = () => {
        setSelectedPlace(null)
        setIsManualFormOpen(true)
        expandSearch()
    }

    const handleOpenSearchTab = () => {
        setIsManualFormOpen(false)
        expandSearch()
    }

    const handleSearchFocus = () => {
        setIsManualFormOpen(false)
        expandSearch()
    }

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsManualFormOpen(false)
        expandSearch()

        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        const query = event.currentTarget.value.trim()

        searchTimerRef.current = setTimeout(
            () => {
                searchFormRef.current?.requestSubmit()
            },
            query ? SEARCH_DEBOUNCE_MS : 0
        )
    }

    const handleSearchExpand = () => {
        expandSearch()
    }

    const handleSheetBlurCapture = (
        event: FocusEvent<HTMLDivElement>,
        isSearching: boolean
    ) => {
        const nextFocusedElement = event.relatedTarget

        if (sheetRef.current?.contains(nextFocusedElement)) {
            return
        }

        if (isManualFormOpen || isSearching) {
            return
        }

        collapseSearch()
    }

    return {
        handleClearSelectedPlace,
        handleClosePanel,
        handleOpenManualForm,
        handleOpenSearchTab,
        handleSearchExpand,
        handleSearchFocus,
        handleSearchInputChange,
        handleSelectPlace,
        handleSheetBlurCapture,
        isContentVisible,
        isClosing,
        isManualFormOpen,
        isSearchExpanded,
        searchOffset,
        searchFormRef,
        searchSectionRef,
        selectedPlace,
        sheetBodyRef,
        sheetRef,
    }
}
