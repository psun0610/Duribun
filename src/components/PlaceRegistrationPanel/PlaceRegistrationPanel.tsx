'use client'

import { useActionState, type CSSProperties } from 'react'
import { MapPin, Search, X } from 'lucide-react'

import {
    registerKakaoPlace,
    registerManualPlace,
    searchKakaoPlaces,
} from '@/features/place/actions'

import type {
    KakaoPlaceResultCardProps,
    PlaceRegistrationPanelProps,
} from './types/placeRegistrationPanel.types'
import {
    INITIAL_REGISTRATION_STATE,
    INITIAL_SEARCH_STATE,
    PLACE_CATEGORY_OPTIONS,
    PLACE_REGISTRATION_COPY,
} from './const/placeRegistrationPanel.const'
import { usePlaceRegistrationPanel } from './hooks/usePlaceRegistrationPanel'

import styles from './PlaceRegistrationPanel.module.scss'

const KakaoPlaceResultRow = ({
    isSelected,
    onSelect,
    place,
}: KakaoPlaceResultCardProps) => {
    return (
        <button
            className={`${styles.resultRow} ${
                isSelected ? styles.selectedResultRow : ''
            }`}
            onClick={() => onSelect(place)}
            type="button"
        >
            <span className={styles.resultIcon}>
                <MapPin aria-hidden="true" size={17} />
            </span>
            <span className={styles.resultBody}>
                <strong>{place.name}</strong>
                <span>
                    {place.roadAddress ||
                        place.address ||
                        place.providerCategoryName}
                </span>
            </span>
        </button>
    )
}

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
                    <button
                        aria-label={PLACE_REGISTRATION_COPY.close}
                        className={styles.closeButton}
                        onClick={handleClosePanel}
                        type="button"
                    >
                        <X aria-hidden="true" size={18} />
                    </button>
                </div>
                <div className={styles.titleArea}>
                    <div className={styles.titleBadge} aria-hidden="true">
                        <MapPin size={22} />
                    </div>
                    <h2
                        className={styles.title}
                        id="place-registration-title"
                    >
                        {PLACE_REGISTRATION_COPY.panelTitle}
                    </h2>
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
                        <p className={styles.errorMessage}>
                            {searchState.errorMessage}
                        </p>
                    ) : null}

                    {shouldShowSearchPrompt ? (
                        <div className={styles.searchPrompt}>
                            <span className={styles.searchPromptIcon}>
                                <Search aria-hidden="true" size={30} />
                            </span>
                            <div className={styles.promptManualArea}>
                                <span>{PLACE_REGISTRATION_COPY.manualHint}</span>
                                <button
                                    className={styles.manualToggle}
                                    onClick={handleOpenManualForm}
                                    type="button"
                                >
                                    {PLACE_REGISTRATION_COPY.manualCta}
                                </button>
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
                                    <button
                                        className={styles.loadMoreButton}
                                        disabled={isSearching}
                                        onMouseDown={handleSearchExpand}
                                        type="submit"
                                    >
                                        {PLACE_REGISTRATION_COPY.loadMore}
                                    </button>
                                </form>
                            ) : null}
                        </>
                    ) : null}

                    {!shouldShowSearchPrompt ? (
                        <div className={styles.manualArea}>
                            <span>{PLACE_REGISTRATION_COPY.manualHint}</span>
                            <button
                                className={styles.manualToggle}
                                onClick={handleOpenManualForm}
                                type="button"
                            >
                                {PLACE_REGISTRATION_COPY.manualCta}
                            </button>
                        </div>
                    ) : null}

                    {isManualFormOpen ? (
                        <form
                            action={registerManualAction}
                            className={styles.manualForm}
                        >
                            <h3>{PLACE_REGISTRATION_COPY.manualTitle}</h3>
                            <input
                                className={styles.input}
                                disabled={isRegisteringManualPlace}
                                name="name"
                                placeholder={
                                    PLACE_REGISTRATION_COPY.manualNamePlaceholder
                                }
                                required
                            />
                            <select
                                className={styles.select}
                                disabled={isRegisteringManualPlace}
                                name="category"
                            >
                                {PLACE_CATEGORY_OPTIONS.map(option => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                className={styles.input}
                                disabled={isRegisteringManualPlace}
                                name="address"
                                placeholder={
                                    PLACE_REGISTRATION_COPY.addressPlaceholder
                                }
                            />
                            <button
                                className={styles.primaryButton}
                                disabled={isRegisteringManualPlace}
                                type="submit"
                            >
                                {isRegisteringManualPlace ? (
                                    <span className={styles.buttonContent}>
                                        <span className={styles.spinner} />
                                        {PLACE_REGISTRATION_COPY.registering}
                                    </span>
                                ) : (
                                    PLACE_REGISTRATION_COPY.manualRegister
                                )}
                            </button>
                            {manualRegistrationState.errorMessage ? (
                                <p className={styles.errorMessage}>
                                    {manualRegistrationState.errorMessage}
                                </p>
                            ) : null}
                        </form>
                    ) : null}
                    </div>
                </div>
                </div>

                {confirmedPlace ? (
                    <form
                        action={registerKakaoAction}
                        className={styles.confirmBar}
                    >
                        <input
                            name="providerPlaceId"
                            type="hidden"
                            value={confirmedPlace.id}
                        />
                        <input
                            name="name"
                            type="hidden"
                            value={confirmedPlace.name}
                        />
                        <input
                            name="category"
                            type="hidden"
                            value={confirmedPlace.category}
                        />
                        <input
                            name="providerCategoryName"
                            type="hidden"
                            value={confirmedPlace.providerCategoryName}
                        />
                        <input
                            name="address"
                            type="hidden"
                            value={confirmedPlace.address}
                        />
                        <input
                            name="roadAddress"
                            type="hidden"
                            value={confirmedPlace.roadAddress}
                        />
                        <input
                            name="latitude"
                            type="hidden"
                            value={confirmedPlace.latitude ?? ''}
                        />
                        <input
                            name="longitude"
                            type="hidden"
                            value={confirmedPlace.longitude ?? ''}
                        />
                        <input
                            name="placeUrl"
                            type="hidden"
                            value={confirmedPlace.placeUrl}
                        />

                        <div className={styles.confirmCopy}>
                            <span>{PLACE_REGISTRATION_COPY.confirmPlace}</span>
                            <strong>{confirmedPlace.name}</strong>
                            <small>
                                {confirmedPlace.roadAddress ||
                                    confirmedPlace.address ||
                                    confirmedPlace.providerCategoryName}
                            </small>
                        </div>
                        {kakaoRegistrationState.errorMessage ? (
                            <p className={styles.errorMessage}>
                                {kakaoRegistrationState.errorMessage}
                            </p>
                        ) : null}
                        <div className={styles.confirmActions}>
                            <button
                                className={styles.secondaryButton}
                                disabled={isRegisteringKakaoPlace}
                                onClick={handleClearSelectedPlace}
                                type="button"
                            >
                                {PLACE_REGISTRATION_COPY.selectAnother}
                            </button>
                            <button
                                className={styles.primaryButton}
                                disabled={isRegisteringKakaoPlace}
                                type="submit"
                            >
                                {isRegisteringKakaoPlace ? (
                                    <span className={styles.buttonContent}>
                                        <span className={styles.spinner} />
                                        {PLACE_REGISTRATION_COPY.registering}
                                    </span>
                                ) : (
                                    PLACE_REGISTRATION_COPY.submitSelectedPlace
                                )}
                            </button>
                        </div>
                    </form>
                ) : null}
            </div>
        </section>
    )
}
