import { Globe, Lock, Star } from 'lucide-react'

import { Badge, Pill } from '@/components/ui'

import {
    CATEGORY_LABEL,
    COUPLE_PLACE_APP_COPY,
    REVIEW_STATUS_LABEL,
} from '../const/couplePlaceApp.const'
import type { MockPlaceCardProps } from '../types/couplePlaceAppComponent.types'
import { getReviewStatusBadgeVariant } from '../utils/couplePlaceApp.utils'

import styles from '../CouplePlaceApp.module.scss'

const PlacePhoto = ({ place }: MockPlaceCardProps) => {
    return (
        <div
            aria-label={place.name}
            className={`${styles.feedPhoto} h-full w-full`}
            role="img"
            style={{ backgroundImage: `url(${place.photoUrl})` }}
        />
    )
}

export const PlaceCardFeed = ({ place }: MockPlaceCardProps) => {
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
                        <Pill
                            className={styles.mockFeedRating}
                            icon={<Star aria-hidden="true" size={12} />}
                            tone="rating"
                        >
                            {place.rating}
                        </Pill>
                    ) : null}
                </div>
            </div>
            <div className="space-y-1 px-0.5">
                <h3 className="truncate text-[13px] font-medium text-foreground">
                    {place.name}
                </h3>
                <Badge
                    size="sm"
                    variant={getReviewStatusBadgeVariant(place.reviewStatus)}
                >
                    {REVIEW_STATUS_LABEL[place.reviewStatus]}
                </Badge>
            </div>
        </article>
    )
}

export const PlaceCardList = ({ place }: MockPlaceCardProps) => {
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
                            <Pill
                                icon={<Star aria-hidden="true" size={12} />}
                                tone="rating"
                            >
                                {place.rating}
                            </Pill>
                        ) : null}
                    </div>
                    <Badge
                        size="sm"
                        variant={getReviewStatusBadgeVariant(place.reviewStatus)}
                    >
                        {REVIEW_STATUS_LABEL[place.reviewStatus]}
                    </Badge>
                </div>
            </div>
        </article>
    )
}
