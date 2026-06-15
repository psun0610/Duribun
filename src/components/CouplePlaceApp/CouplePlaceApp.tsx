'use client'

import {
    Compass,
    Globe,
    LayoutGrid,
    List,
    Lock,
    MapPin,
    Plus,
    Star,
    Users,
    type LucideIcon,
} from 'lucide-react'

import { PlaceRegistrationPanel } from '@/components/PlaceRegistrationPanel'
import { ReviewDetailPanel } from '@/components/ReviewDetailPanel'
import { ReviewWriterPanel } from '@/components/ReviewWriterPanel'
import { signOut } from '@/features/auth/actions'
import { requestCoupleDisconnect } from '@/features/couple/actions'
import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'
import type { CouplePlaceReviewDetail } from '@/features/review/types/reviewDetail.types'

import {
    CATEGORY_LABEL,
    COUPLE_PLACE_APP_COPY,
    MOCK_PLACES,
    REVIEW_STATUS_LABEL,
    TAB_ITEMS,
} from './const/couplePlaceApp.const'
import type {
    CouplePlace,
    CouplePlaceAppProps,
    ReviewDetailTargetPlace,
    ReviewStatus,
} from './types/couplePlaceApp.types'
import { useCouplePlaceApp } from './hooks/useCouplePlaceApp'

import styles from './CouplePlaceApp.module.scss'

const getStatusClassName = (status: ReviewStatus) => {
    const baseClassName =
        'inline-flex self-start rounded-full px-2 py-0.5 text-[11px] font-medium'

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

const getListStatusClassName = (status: ReviewStatus) => {
    const baseClassName =
        'inline-flex self-start rounded-full px-2.5 py-1 text-[11px] font-medium'

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

const formatRating = (rating: number) => {
    const rounded = Math.round(rating * 10) / 10

    return Number.isInteger(rounded) ? rounded.toFixed(1) : `${rounded}`
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
            <div className="mb-2 overflow-hidden rounded-[1.25rem] border border-border shadow-sm transition-all duration-300 group-hover:shadow-md">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/15 to-secondary/15">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                        <PlacePhoto place={place} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute right-2 top-2">
                        {place.isPublic ? (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/90 shadow">
                                <Globe
                                    aria-label={COUPLE_PLACE_APP_COPY.public}
                                    className="h-3 w-3 text-white"
                                />
                            </span>
                        ) : (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/35 shadow backdrop-blur-sm">
                                <Lock
                                    aria-label={COUPLE_PLACE_APP_COPY.private}
                                    className="h-3 w-3 text-white"
                                />
                            </span>
                        )}
                    </div>
                    {place.rating ? (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 shadow">
                            <Star
                                aria-hidden="true"
                                className="h-2.5 w-2.5 fill-secondary text-secondary"
                            />
                            <span className="text-[11px] font-medium text-foreground">
                                {place.rating}
                            </span>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="space-y-1 px-0.5">
                <h3 className="truncate text-[13px] font-medium text-foreground">
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
        <article className="rounded-[1.25rem] border border-border bg-white p-3.5 transition-all hover:shadow-md">
            <div className="flex gap-3.5">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15">
                    <PlacePhoto place={place} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
                    <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <h3 className="truncate text-[15px] font-medium">
                                    {place.name}
                                </h3>
                                <p className="text-[13px] font-normal text-muted-foreground">
                                    {CATEGORY_LABEL[place.category]}
                                    {place.visitDate
                                        ? ` / ${place.visitDate}`
                                        : ''}
                                </p>
                            </div>
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                                {place.isPublic ? (
                                    <Globe
                                        aria-label={COUPLE_PLACE_APP_COPY.public}
                                        className="h-3 w-3 text-primary"
                                    />
                                ) : (
                                    <Lock
                                        aria-label={COUPLE_PLACE_APP_COPY.private}
                                        className="h-3 w-3 text-muted-foreground"
                                    />
                                )}
                            </span>
                        </div>
                        {place.rating ? (
                            <div className="flex items-center gap-1">
                                <Star
                                    aria-hidden="true"
                                    className="h-3 w-3 fill-secondary text-secondary"
                                />
                                <span className="text-[13px] font-medium">
                                    {place.rating}
                                </span>
                            </div>
                        ) : null}
                    </div>
                    <span className={getListStatusClassName(place.reviewStatus)}>
                        {REVIEW_STATUS_LABEL[place.reviewStatus]}
                    </span>
                </div>
            </div>
        </article>
    )
}

const getRegisteredPlaceStatus = (
    detail: CouplePlaceReviewDetail | undefined
): ReviewStatus => {
    return detail?.reviewStatus ?? 'none'
}

const getRegisteredPlaceRating = (
    detail: CouplePlaceReviewDetail | undefined
) => {
    if (detail?.averageRating === null || detail?.averageRating === undefined) {
        return null
    }

    return formatRating(detail.averageRating)
}

const getReviewDetailTargetPlace = (
    place: CouplePlaceListItem
): ReviewDetailTargetPlace => ({
    category: place.category,
    couplePlaceId: place.couplePlaceId,
    isPublic: place.isPublic,
    name: place.name,
})

const getFallbackReviewDetail = (
    place: ReviewDetailTargetPlace
): CouplePlaceReviewDetail => ({
    averageRating: null,
    couplePlaceId: place.couplePlaceId,
    reviewCount: 0,
    reviewStatus: 'none',
    reviews: [],
})

const RegisteredPlaceFeedCard = ({
    detail,
    onOpenReviewDetail,
    place,
}: {
    detail: CouplePlaceReviewDetail | undefined
    onOpenReviewDetail: (place: ReviewDetailTargetPlace) => void
    place: CouplePlaceListItem
}) => {
    const status = getRegisteredPlaceStatus(detail)
    const rating = getRegisteredPlaceRating(detail)

    return (
        <button
            className={styles.registeredFeedCard}
            onClick={() => onOpenReviewDetail(getReviewDetailTargetPlace(place))}
            type="button"
        >
            <span className={styles.registeredFeedVisual}>
                <MapPin aria-hidden="true" />
                <span className={styles.registeredPrivacyIcon}>
                    {place.isPublic ? (
                        <Globe
                            aria-label={COUPLE_PLACE_APP_COPY.public}
                            size={13}
                        />
                    ) : (
                        <Lock
                            aria-label={COUPLE_PLACE_APP_COPY.private}
                            size={13}
                        />
                    )}
                </span>
                {rating ? (
                    <span className={styles.registeredRating}>
                        <Star aria-hidden="true" size={12} />
                        {rating}
                    </span>
                ) : null}
            </span>
            <span className={styles.registeredFeedBody}>
                <strong>{place.name}</strong>
                <span className={getStatusClassName(status)}>
                    {REVIEW_STATUS_LABEL[status]}
                </span>
            </span>
        </button>
    )
}

const RegisteredPlaceListCard = ({
    detail,
    onOpenReviewDetail,
    place,
}: {
    detail: CouplePlaceReviewDetail | undefined
    onOpenReviewDetail: (place: ReviewDetailTargetPlace) => void
    place: CouplePlaceListItem
}) => {
    const status = getRegisteredPlaceStatus(detail)
    const rating = getRegisteredPlaceRating(detail)

    return (
        <button
            className={styles.registeredListCard}
            onClick={() => onOpenReviewDetail(getReviewDetailTargetPlace(place))}
            type="button"
        >
            <span className={styles.registeredListVisual}>
                <MapPin aria-hidden="true" />
            </span>
            <span className={styles.registeredListBody}>
                <span className={styles.registeredListHeader}>
                    <strong>{place.name}</strong>
                    <span className={styles.registeredPrivacyIconInline}>
                        {place.isPublic ? (
                            <Globe
                                aria-label={COUPLE_PLACE_APP_COPY.public}
                                size={13}
                            />
                        ) : (
                            <Lock
                                aria-label={COUPLE_PLACE_APP_COPY.private}
                                size={13}
                            />
                        )}
                    </span>
                </span>
                <span className={styles.registeredMeta}>
                    {CATEGORY_LABEL[place.category]}
                    {place.roadAddress || place.address
                        ? ` / ${place.roadAddress || place.address}`
                        : ''}
                </span>
                {rating ? (
                    <span className={styles.registeredListRating}>
                        <Star aria-hidden="true" size={12} />
                        {rating}
                    </span>
                ) : null}
                <span className={getListStatusClassName(status)}>
                    {REVIEW_STATUS_LABEL[status]}
                </span>
            </span>
        </button>
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
    currentUserId,
    places,
    reviewDetailsByPlaceId,
}: CouplePlaceAppProps) => {
    const {
        activeTab,
        handleCloseRegistrationPanel,
        handleCloseReviewDetail,
        handleCloseReviewWriter,
        handleFeedView,
        handleListView,
        handleOpenRegistrationPanel,
        handleOpenReviewDetail,
        handleTabChange,
        isRegistrationPanelOpen,
        reviewDetailTargetPlace,
        reviewTargetPlace,
        viewMode,
    } = useCouplePlaceApp()
    const reviewDetail =
        reviewDetailTargetPlace &&
        (reviewDetailsByPlaceId[reviewDetailTargetPlace.couplePlaceId] ??
            getFallbackReviewDetail(reviewDetailTargetPlace))

    return (
        <main className={`${styles.app} flex flex-col`}>
            <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[12px] font-medium tracking-widest text-muted-foreground uppercase">
                            {COUPLE_PLACE_APP_COPY.appTitle}
                        </p>
                        <h1 className="mt-0.5 text-[1.375rem] font-semibold leading-tight text-foreground">
                            {coupleName}
                        </h1>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                        <button
                            aria-label={COUPLE_PLACE_APP_COPY.feedView}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                                viewMode === 'feed'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-muted-foreground'
                            }`}
                            onClick={handleFeedView}
                            type="button"
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </button>
                        <button
                            aria-label={COUPLE_PLACE_APP_COPY.listView}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                                viewMode === 'list'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-muted-foreground'
                            }`}
                            onClick={handleListView}
                            type="button"
                        >
                            <List className="h-3.5 w-3.5" />
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

                {activeTab === 'places' && reviewDetailTargetPlace ? (
                    <ReviewDetailPanel
                        currentUserId={currentUserId}
                        detail={reviewDetail}
                        onClose={handleCloseReviewDetail}
                        place={reviewDetailTargetPlace}
                    />
                ) : null}

                {activeTab === 'places' && places.length > 0 ? (
                    <div
                        className={
                            viewMode === 'feed'
                                ? styles.registeredFeedGrid
                                : styles.registeredList
                        }
                    >
                        {places.map(place =>
                            viewMode === 'feed' ? (
                                <RegisteredPlaceFeedCard
                                    detail={
                                        reviewDetailsByPlaceId[
                                            place.couplePlaceId
                                        ]
                                    }
                                    key={place.couplePlaceId}
                                    onOpenReviewDetail={handleOpenReviewDetail}
                                    place={place}
                                />
                            ) : (
                                <RegisteredPlaceListCard
                                    detail={
                                        reviewDetailsByPlaceId[
                                            place.couplePlaceId
                                        ]
                                    }
                                    key={place.couplePlaceId}
                                    onOpenReviewDetail={handleOpenReviewDetail}
                                    place={place}
                                />
                            )
                        )}
                    </div>
                ) : null}

                {activeTab === 'places' && places.length === 0 ? (
                    <div
                        className={
                            viewMode === 'feed'
                                ? 'grid grid-cols-3 gap-2'
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
