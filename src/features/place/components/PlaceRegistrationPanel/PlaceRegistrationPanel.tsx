'use client'

import { useActionState, type CSSProperties } from 'react'
import { Search, X } from 'lucide-react'

import { Button, FieldMessage, IconButton } from '@/components/ui'
import {
    registerKakaoPlace,
    registerManualPlace,
    searchKakaoPlaces,
} from '@/features/place/actions'

import { ConfirmPlaceBar } from './components/ConfirmPlaceBar'
import { KakaoPlaceResultRow } from './components/KakaoPlaceResultRow'
import { ManualPlaceForm } from './components/ManualPlaceForm'
import type { PlaceRegistrationPanelProps } from './types/placeRegistrationPanel.types'
import {
    INITIAL_REGISTRATION_STATE,
    INITIAL_SEARCH_STATE,
    PLACE_REGISTRATION_COPY,
} from './const/placeRegistrationPanel.const'
import { usePlaceRegistrationPanel } from './hooks/usePlaceRegistrationPanel'

import styles from './PlaceRegistrationPanel.module.scss'

export const PlaceRegistrationPanel = ({
    onClose,
}: PlaceRegistrationPanelProps) => {
    const [searchState, searchAction, isSearching] = useActionState(
        searchKakaoPlaces,
        INITIAL_SEARCH_STATE
    )
    const [
        kakaoRegistrationState,
        registerKakaoAction,
        isRegisteringKakaoPlace,
    ] = useActionState(registerKakaoPlace, INITIAL_REGISTRATION_STATE)
    const [
        manualRegistrationState,
        registerManualAction,
        isRegisteringManualPlace,
    ] = useActionState(registerManualPlace, INITIAL_REGISTRATION_STATE)
    const {
        handleClearSelectedPlace,
        handleClosePanel,
        handleOpenManualForm,
        handleSearchExpand,
        handleSearchFocus,
        handleSearchInputChange,
        handleSelectPlace,
        handleSheetBlurCapture,
        isClosing,
        isContentVisible,
        isManualFormOpen,
        isSearchExpanded,
        searchOffset,
        searchFormRef,
        searchSectionRef,
        selectedPlace,
        sheetBodyRef,
        sheetRef,
    } = usePlaceRegistrationPanel({
        hasKakaoRegistrationSucceeded: kakaoRegistrationState.succeeded,
        hasManualRegistrationSucceeded: manualRegistrationState.succeeded,
        onClose,
    })
    const confirmedPlace = searchState.results.find(
        place => place.id === selectedPlace?.id
    )
    const hasSearchFeedback =
        Boolean(searchState.query) ||
        Boolean(searchState.errorMessage) ||
        searchState.results.length > 0 ||
        isManualFormOpen
    const isSearchLayoutActive =
        isSearchExpanded || isSearching || hasSearchFeedback
    const isContentShown = isContentVisible || isSearching || hasSearchFeedback
    const shouldShowSearchPrompt =
        isSearchLayoutActive &&
        !searchState.query &&
        !searchState.errorMessage &&
        searchState.results.length === 0 &&
        !isManualFormOpen

    return (
        <section
            aria-labelledby="place-registration-title"
            aria-modal="true"
            className={`${styles.overlay} ${isClosing ? styles.closing : ''}`}
            role="dialog"
        >
            <div className={styles.backdrop} onClick={handleClosePanel} />
            <div
                ref={sheetRef}
                className={`${styles.sheet} ${
                    isSearchLayoutActive ? styles.sheetExpanded : ''
                }`}
                onBlurCapture={event =>
                    handleSheetBlurCapture(event, isSearching)
                }
            >
                <div className={styles.header}>
                    <IconButton
                        aria-label={PLACE_REGISTRATION_COPY.close}
                        onClick={handleClosePanel}
                        type="button"
                    >
                        <X aria-hidden="true" size={18} />
                    </IconButton>
                </div>
                <div className={styles.titleArea}>
                    <h2
                        className={styles.title}
                        id="place-registration-title"
                    >
                        {PLACE_REGISTRATION_COPY.panelTitle}
                    </h2>
                    <div className={styles.registrationTabs} role="tablist">
                        <button
                            className={styles.registrationTabActive}
                            type="button"
                        >
                            {PLACE_REGISTRATION_COPY.searchTab}
                        </button>
                        <button
                            className={styles.registrationTab}
                            onClick={handleOpenManualForm}
                            type="button"
                        >
                            {PLACE_REGISTRATION_COPY.manualTab}
                        </button>
                    </div>
                </div>

                <div ref={sheetBodyRef} className={styles.sheetBody}>
                    <div
                        ref={searchSectionRef}
                        className={styles.searchSection}
                        style={
                            {
                                '--search-offset': isSearchLayoutActive
                                    ? '0px'
                                    : `${searchOffset}px`,
                            } as CSSProperties
                        }
                    >
                        <form
                            action={searchAction}
                            className={styles.searchForm}
                            ref={searchFormRef}
                        >
                            <input name="mode" type="hidden" value="replace" />
                            <input name="page" type="hidden" value="1" />
                            <label className={styles.searchField}>
                                <Search aria-hidden="true" size={18} />
                                <input
                                    defaultValue={searchState.query}
                                    name="query"
                                    onChange={handleSearchInputChange}
                                    onFocus={handleSearchFocus}
                                    placeholder={
                                        PLACE_REGISTRATION_COPY.searchPlaceholder
                                    }
                                    type="search"
                                />
                            </label>
                        </form>
                    </div>

                    <div className={styles.content}>
                    <div
                        aria-hidden={!isContentShown}
                        className={`${styles.contentInner} ${
                            isContentShown ? styles.contentInnerVisible : ''
                        }`}
                    >
                    {searchState.errorMessage ? (
                        <FieldMessage variant="error">
                            {searchState.errorMessage}
                        </FieldMessage>
                    ) : null}

                    {shouldShowSearchPrompt ? (
                        <div className={styles.searchPrompt}>
                            <span className={styles.searchPromptIcon}>
                                <Search aria-hidden="true" size={30} />
                            </span>
                            <div className={styles.promptManualArea}>
                                <span>{PLACE_REGISTRATION_COPY.manualHint}</span>
                                <Button
                                    onClick={handleOpenManualForm}
                                    type="button"
                                    variant="ghost"
                                >
                                    {PLACE_REGISTRATION_COPY.manualCta}
                                </Button>
                            </div>
                        </div>
                    ) : null}

                    {searchState.query &&
                    searchState.results.length === 0 &&
                    !isSearching ? (
                        <p className={styles.emptyText}>
                            {PLACE_REGISTRATION_COPY.noSearchResults}
                        </p>
                    ) : null}

                    {searchState.results.length > 0 ? (
                        <>
                            <div className={styles.results}>
                                {searchState.results.map(place => (
                                    <KakaoPlaceResultRow
                                        isSelected={
                                            confirmedPlace?.id === place.id
                                        }
                                        key={place.id}
                                        onSelect={handleSelectPlace}
                                        place={place}
                                    />
                                ))}
                            </div>
                            {!searchState.isEnd ? (
                                <form
                                    action={searchAction}
                                    className={styles.loadMoreForm}
                                >
                                    <input
                                        name="mode"
                                        type="hidden"
                                        value="append"
                                    />
                                    <input
                                        name="query"
                                        type="hidden"
                                        value={searchState.query}
                                    />
                                    <input
                                        name="page"
                                        type="hidden"
                                        value={searchState.page + 1}
                                    />
                                    <Button
                                        disabled={isSearching}
                                        onMouseDown={handleSearchExpand}
                                        size="sm"
                                        type="submit"
                                        variant="secondary"
                                    >
                                        {PLACE_REGISTRATION_COPY.loadMore}
                                    </Button>
                                </form>
                            ) : null}
                        </>
                    ) : null}

                    {!shouldShowSearchPrompt ? (
                        <div className={styles.manualArea}>
                            <span>{PLACE_REGISTRATION_COPY.manualHint}</span>
                            <Button
                                onClick={handleOpenManualForm}
                                type="button"
                                variant="ghost"
                            >
                                {PLACE_REGISTRATION_COPY.manualCta}
                            </Button>
                        </div>
                    ) : null}

                    {isManualFormOpen ? (
                        <ManualPlaceForm
                            isRegisteringManualPlace={
                                isRegisteringManualPlace
                            }
                            manualRegistrationState={manualRegistrationState}
                            registerManualAction={registerManualAction}
                        />
                    ) : null}
                    </div>
                </div>
                </div>

                {confirmedPlace ? (
                    <ConfirmPlaceBar
                        confirmedPlace={confirmedPlace}
                        isRegisteringKakaoPlace={isRegisteringKakaoPlace}
                        kakaoRegistrationState={kakaoRegistrationState}
                        onClearSelectedPlace={handleClearSelectedPlace}
                        registerKakaoAction={registerKakaoAction}
                    />
                ) : null}
            </div>
        </section>
    )
}
