'use client'

import { useActionState } from 'react'
import { Search, X } from 'lucide-react'

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
    PLACE_CATEGORY_OPTIONS,
    PLACE_REGISTRATION_COPY,
} from './const/placeRegistrationPanel.const'

import styles from './PlaceRegistrationPanel.module.scss'

const INITIAL_REGISTRATION_STATE = {
    errorMessage: '',
}

const INITIAL_SEARCH_STATE = {
    errorMessage: '',
    query: '',
    results: [],
}

const KakaoPlaceResultCard = ({ place }: KakaoPlaceResultCardProps) => {
    const [registrationState, registerAction] = useActionState(
        registerKakaoPlace,
        INITIAL_REGISTRATION_STATE
    )

    return (
        <form action={registerAction} className={styles.resultCard}>
            <input name="providerPlaceId" type="hidden" value={place.id} />
            <input name="name" type="hidden" value={place.name} />
            <input name="category" type="hidden" value={place.category} />
            <input
                name="providerCategoryName"
                type="hidden"
                value={place.providerCategoryName}
            />
            <input name="address" type="hidden" value={place.address} />
            <input name="roadAddress" type="hidden" value={place.roadAddress} />
            <input
                name="latitude"
                type="hidden"
                value={place.latitude ?? ''}
            />
            <input
                name="longitude"
                type="hidden"
                value={place.longitude ?? ''}
            />
            <input name="placeUrl" type="hidden" value={place.placeUrl} />

            <div>
                <span className={styles.badge}>
                    {PLACE_REGISTRATION_COPY.kakaoBadge}
                </span>
                <p className={styles.placeName}>{place.name}</p>
                <p className={styles.meta}>
                    {place.roadAddress || place.address || place.providerCategoryName}
                </p>
            </div>
            <button className={styles.button} type="submit">
                {PLACE_REGISTRATION_COPY.kakaoRegister}
            </button>
            {registrationState.errorMessage ? (
                <p className={styles.errorMessage}>
                    {registrationState.errorMessage}
                </p>
            ) : null}
        </form>
    )
}

export const PlaceRegistrationPanel = ({
    onClose,
}: PlaceRegistrationPanelProps) => {
    const [searchState, searchAction] = useActionState(
        searchKakaoPlaces,
        INITIAL_SEARCH_STATE
    )
    const [manualRegistrationState, registerManualAction] = useActionState(
        registerManualPlace,
        INITIAL_REGISTRATION_STATE
    )

    return (
        <section className={styles.panel}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {PLACE_REGISTRATION_COPY.panelTitle}
                </h2>
                <button
                    aria-label={PLACE_REGISTRATION_COPY.close}
                    className={styles.closeButton}
                    onClick={onClose}
                    type="button"
                >
                    <X aria-hidden="true" size={16} />
                </button>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                        {PLACE_REGISTRATION_COPY.kakaoTitle}
                    </h3>
                    <p className={styles.description}>
                        {PLACE_REGISTRATION_COPY.kakaoDescription}
                    </p>
                </div>

                <form action={searchAction} className={styles.inlineForm}>
                    <input
                        className={styles.input}
                        defaultValue={searchState.query}
                        name="query"
                        placeholder={PLACE_REGISTRATION_COPY.searchPlaceholder}
                        type="search"
                    />
                    <button className={styles.button} type="submit">
                        <Search aria-hidden="true" size={16} />
                        {PLACE_REGISTRATION_COPY.search}
                    </button>
                </form>

                {searchState.errorMessage ? (
                    <p className={styles.errorMessage}>
                        {searchState.errorMessage}
                    </p>
                ) : null}

                {searchState.query && searchState.results.length === 0 ? (
                    <p className={styles.description}>
                        {PLACE_REGISTRATION_COPY.noSearchResults}
                    </p>
                ) : null}

                <div className={styles.results}>
                    {searchState.results.map(place => (
                        <KakaoPlaceResultCard
                            key={place.id}
                            place={place}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                        {PLACE_REGISTRATION_COPY.manualTitle}
                    </h3>
                    <p className={styles.description}>
                        {PLACE_REGISTRATION_COPY.manualDescription}
                    </p>
                </div>

                <form
                    action={registerManualAction}
                    className={styles.formGrid}
                >
                    <input
                        className={styles.input}
                        name="name"
                        placeholder={PLACE_REGISTRATION_COPY.manualNamePlaceholder}
                        required
                    />
                    <select className={styles.select} name="category">
                        {PLACE_CATEGORY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <input
                        className={styles.input}
                        name="address"
                        placeholder={PLACE_REGISTRATION_COPY.addressPlaceholder}
                    />
                    <input
                        className={styles.input}
                        name="roadAddress"
                        placeholder={
                            PLACE_REGISTRATION_COPY.roadAddressPlaceholder
                        }
                    />
                    <button className={styles.button} type="submit">
                        {PLACE_REGISTRATION_COPY.manualRegister}
                    </button>
                    {manualRegistrationState.errorMessage ? (
                        <p className={styles.errorMessage}>
                            {manualRegistrationState.errorMessage}
                        </p>
                    ) : null}
                </form>
            </div>
        </section>
    )
}
