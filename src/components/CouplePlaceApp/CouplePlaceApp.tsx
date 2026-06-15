'use client'

import {
    Compass,
    Globe,
    LayoutGrid,
    List,
    Lock,
    Plus,
    Search,
    Star,
    Users,
    type LucideIcon,
} from 'lucide-react'

import { PlaceRegistrationPanel } from '@/components/PlaceRegistrationPanel'
import { ReviewWriterPanel } from '@/components/ReviewWriterPanel'
import { signOut } from '@/features/auth/actions'
import { requestCoupleDisconnect } from '@/features/couple/actions'
import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'

import {
    CATEGORY_LABEL,
    COUPLE_PLACE_APP_COPY,
    MOCK_PLACES,
    PROVIDER_LABEL,
    REVIEW_STATUS_LABEL,
    TAB_ITEMS,
} from './const/couplePlaceApp.const'
import type {
    CouplePlace,
    CouplePlaceAppProps,
    ReviewTargetPlace,
    ReviewStatus,
} from './types/couplePlaceApp.types'
import { useCouplePlaceApp } from './hooks/useCouplePlaceApp'

import styles from './CouplePlaceApp.module.scss'

const getStatusClassName = (status: ReviewStatus) => {
    const baseClassName =
        'inline-flex self-start rounded-full px-2.5 py-1 text-[11px] font-semibold'

    if (status === 'complete') {
        return `${baseClassName} bg-secondary text-foreground`
    }

    if (status === 'partner-waiting') {
        return `${baseClassName} bg-primary text-primary-foreground`
    }

    if (status === 'waiting-partner') {
        return `${baseClassName} bg-primary/20 text-primary`
    }

    return `${baseClassName} bg-muted text-muted-foreground`
}

const PlacePhoto = ({ place }: { place: CouplePlace }) => {
    return (
        <div
            aria-label={place.name}
            className={`${styles.feedPhoto} h-full w-full`}
            role="img"
            style={{ backgroundImage: `url(${place.photoUrl})` }}
        />
    )
}

const PlaceCardFeed = ({ place }: { place: CouplePlace }) => {
    return (
        <article className="group cursor-pointer">
            <div className="mb-3 overflow-hidden rounded-[2rem] border-2 border-transparent shadow-md transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-2xl">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
                        <PlacePhoto place={place} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute right-3 top-3">
                        {place.isPublic ? (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                                <Globe
                                    aria-label={COUPLE_PLACE_APP_COPY.public}
                                    className="h-4 w-4 text-white"
                                />
                            </span>
                        ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 shadow-lg backdrop-blur-md">
                                <Lock
                                    aria-label={COUPLE_PLACE_APP_COPY.private}
                                    className="h-4 w-4 text-white"
                                />
                            </span>
                        )}
                    </div>
                    {place.rating ? (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-lg">
                            <Star
                                aria-hidden="true"
                                className="h-3.5 w-3.5 fill-secondary text-secondary"
                            />
                            <span className="text-[15px] font-bold text-foreground">
                                {place.rating}
                            </span>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="space-y-2 px-1">
                <h3 className="truncate text-[15px] font-bold text-foreground">
                    {place.name}
                </h3>
                <span className={getStatusClassName(place.reviewStatus)}>
                    {REVIEW_STATUS_LABEL[place.reviewStatus]}
                </span>
            </div>
        </article>
    )
}

const PlaceCardList = ({ place }: { place: CouplePlace }) => {
    return (
        <article className="rounded-[1.5rem] border-2 border-border bg-white p-4 transition-all hover:border-primary/20 hover:shadow-lg">
            <div className="flex gap-4">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
                    <PlacePhoto place={place} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <h3 className="truncate text-[17px] font-bold">
                                    {place.name}
                                </h3>
                                <p className="text-[13px] font-medium text-muted-foreground">
                                    {CATEGORY_LABEL[place.category]}
                                    {place.visitDate
                                        ? ` / ${place.visitDate}`
                                        : ''}
                                </p>
                            </div>
                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                                {place.isPublic ? (
                                    <Globe
                                        aria-label={COUPLE_PLACE_APP_COPY.public}
                                        className="h-3.5 w-3.5 text-primary"
                                    />
                                ) : (
                                    <Lock
                                        aria-label={COUPLE_PLACE_APP_COPY.private}
                                        className="h-3.5 w-3.5 text-muted-foreground"
                                    />
                                )}
                            </span>
                        </div>
                        {place.rating ? (
                            <div className="flex items-center gap-1.5">
                                <Star
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5 fill-secondary text-secondary"
                                />
                                <span className="text-[15px] font-bold">
                                    {place.rating}
                                </span>
                            </div>
                        ) : null}
                    </div>
                    <span className={getStatusClassName(place.reviewStatus)}>
                        {REVIEW_STATUS_LABEL[place.reviewStatus]}
                    </span>
                </div>
            </div>
        </article>
    )
}

const RegisteredPlaceCard = ({
    place,
    onOpenReviewWriter,
}: {
    onOpenReviewWriter: (place: ReviewTargetPlace) => void
    place: CouplePlaceListItem
}) => {
    return (
        <article className={styles.registeredPlaceCard}>
            <div className={styles.registeredPlaceIcon}>
                <Search aria-hidden="true" />
            </div>
            <div className={styles.registeredPlaceBody}>
                <div className={styles.registeredPlaceHeader}>
                    <h3>{place.name}</h3>
                    <span>{PROVIDER_LABEL[place.provider]}</span>
                </div>
                <p>
                    {CATEGORY_LABEL[place.category]}
                    {place.roadAddress || place.address
                        ? ` / ${place.roadAddress || place.address}`
                        : ''}
                </p>
                {place.provider === 'manual' && !place.isExploreApproved ? (
                    <strong>
                        {COUPLE_PLACE_APP_COPY.manualExplorePending}
                    </strong>
                ) : null}
                <button
                    className={styles.reviewButton}
                    onClick={() =>
                        onOpenReviewWriter({
                            category: place.category,
                            couplePlaceId: place.couplePlaceId,
                            name: place.name,
                        })
                    }
                    type="button"
                >
                    리뷰 작성
                </button>
            </div>
            <span className={styles.privacyPill}>
                {place.isPublic
                    ? COUPLE_PLACE_APP_COPY.public
                    : COUPLE_PLACE_APP_COPY.private}
            </span>
        </article>
    )
}

const EmptyTab = ({
    icon: Icon,
    title,
    description,
}: {
    description: string
    icon: LucideIcon
    title: string
}) => {
    return (
        <section className="space-y-5 py-20 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-secondary shadow-2xl">
                <Icon className="h-12 w-12 text-white" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mx-auto max-w-xs text-[15px] font-normal leading-6 text-muted-foreground">
                    {description}
                </p>
            </div>
        </section>
    )
}

export const CouplePlaceApp = ({
    coupleName,
    places,
    userLabel,
}: CouplePlaceAppProps) => {
    const {
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
    } = useCouplePlaceApp()

    return (
        <main className={`${styles.app} flex flex-col`}>
            <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-[2rem] font-bold text-transparent">
                            {COUPLE_PLACE_APP_COPY.appTitle}
                        </h1>
                        <p className="mt-1 text-[13px] font-medium text-muted-foreground">
                            {coupleName} / {userLabel}
                            {COUPLE_PLACE_APP_COPY.recordSuffix}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-muted p-1.5">
                        <button
                            aria-label={COUPLE_PLACE_APP_COPY.feedView}
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                viewMode === 'feed'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-muted-foreground'
                            }`}
                            onClick={handleFeedView}
                            type="button"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            aria-label={COUPLE_PLACE_APP_COPY.listView}
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                viewMode === 'list'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-muted-foreground'
                            }`}
                            onClick={handleListView}
                            type="button"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {activeTab === 'places' && isRegistrationPanelOpen ? (
                    <PlaceRegistrationPanel
                        onClose={handleCloseRegistrationPanel}
                    />
                ) : null}

                {activeTab === 'places' && reviewTargetPlace ? (
                    <ReviewWriterPanel
                        onClose={handleCloseReviewWriter}
                        place={reviewTargetPlace}
                    />
                ) : null}

                {activeTab === 'places' && places.length > 0 ? (
                    <div className={styles.registeredPlaces}>
                        {places.map(place => (
                            <RegisteredPlaceCard
                                key={place.couplePlaceId}
                                onOpenReviewWriter={handleOpenReviewWriter}
                                place={place}
                            />
                        ))}
                    </div>
                ) : null}

                {activeTab === 'places' && places.length === 0 ? (
                    <div
                        className={
                            viewMode === 'feed'
                                ? 'grid grid-cols-2 gap-3'
                                : 'space-y-3'
                        }
                    >
                        {MOCK_PLACES.map(place =>
                            viewMode === 'feed' ? (
                                <PlaceCardFeed key={place.id} place={place} />
                            ) : (
                                <PlaceCardList key={place.id} place={place} />
                            )
                        )}
                    </div>
                ) : null}

                {activeTab === 'friends' ? (
                    <EmptyTab
                        description={COUPLE_PLACE_APP_COPY.friendDescription}
                        icon={Users}
                        title={COUPLE_PLACE_APP_COPY.friendTitle}
                    />
                ) : null}

                {activeTab === 'explore' ? (
                    <EmptyTab
                        description={COUPLE_PLACE_APP_COPY.exploreDescription}
                        icon={Compass}
                        title={COUPLE_PLACE_APP_COPY.exploreTitle}
                    />
                ) : null}

                {activeTab === 'settings' ? (
                    <section className="space-y-5 py-20 text-center">
                        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-secondary shadow-2xl">
                            <Lock
                                className="h-12 w-12 text-white"
                                strokeWidth={2.5}
                            />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">
                                {COUPLE_PLACE_APP_COPY.settingsTitle}
                            </h2>
                            <p className="mx-auto max-w-xs text-[15px] font-normal leading-6 text-muted-foreground">
                                {COUPLE_PLACE_APP_COPY.settingsDescription}
                            </p>
                        </div>
                        <form action={signOut}>
                            <button
                                className="rounded-2xl bg-muted px-5 py-3 text-[15px] font-semibold text-foreground transition hover:bg-primary hover:text-white"
                                type="submit"
                            >
                                {COUPLE_PLACE_APP_COPY.logout}
                            </button>
                        </form>
                        <form action={requestCoupleDisconnect}>
                            <button
                                className="rounded-2xl bg-primary/10 px-5 py-3 text-[15px] font-semibold text-primary transition hover:bg-primary hover:text-white"
                                type="submit"
                            >
                                {COUPLE_PLACE_APP_COPY.requestDisconnect}
                            </button>
                        </form>
                    </section>
                ) : null}
            </section>

            <nav className="sticky bottom-0 border-t-2 border-border bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
                <div
                    className={`${styles.bottomNav} mx-auto flex max-w-2xl items-center justify-around px-4 pt-2`}
                >
                    {TAB_ITEMS.slice(0, 2).map(item => {
                        const Icon = item.icon
                        const isActive = activeTab === item.value

                        return (
                            <button
                                className="flex flex-col items-center gap-1 rounded-2xl px-5 py-2.5"
                                key={item.value}
                                onClick={() => handleTabChange(item.value)}
                                type="button"
                            >
                                <Icon
                                    className={`h-6 w-6 ${
                                        isActive
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                    }`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span
                                    className={`text-xs font-semibold ${
                                        isActive
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}

                    <button
                        aria-label={COUPLE_PLACE_APP_COPY.addPlace}
                        className={`${styles.centerAction} -mt-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary to-secondary text-white transition active:scale-95`}
                        onClick={handleOpenRegistrationPanel}
                        type="button"
                    >
                        <Plus className="h-7 w-7" strokeWidth={3} />
                    </button>

                    {TAB_ITEMS.slice(2).map(item => {
                        const Icon = item.icon
                        const isActive = activeTab === item.value

                        return (
                            <button
                                className="flex flex-col items-center gap-1 rounded-2xl px-5 py-2.5"
                                key={item.value}
                                onClick={() => handleTabChange(item.value)}
                                type="button"
                            >
                                <Icon
                                    className={`h-6 w-6 ${
                                        isActive
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                    }`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span
                                    className={`text-xs font-semibold ${
                                        isActive
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </nav>
        </main>
    )
}
