'use client'

import Image from 'next/image'
import { useActionState, useState } from 'react'
import { Check, Copy, Lock, RefreshCw, Star, Users } from 'lucide-react'

import { Badge, Button, FieldMessage, Pill, TextField } from '@/components/ui'
import {
    addFriendCoupleByCode,
    regenerateFriendCode,
    updateFriendCoupleFilter,
} from '@/features/friend/actions'
import type { FriendActionState } from '@/features/friend/types/friendRelationship.types'

import type { FriendRecommendationsPanelProps } from '../types/couplePlaceAppComponent.types'
import { CATEGORY_LABEL, COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'

import styles from './FriendRecommendationsPanel.module.scss'

const EMPTY_FRIEND_STATE: FriendActionState = {
    errorMessage: '',
    succeeded: false,
}

export const FriendRecommendationsPanel = ({
    friendCode,
    friendCouples,
    recommendations,
}: FriendRecommendationsPanelProps) => {
    const [hasCopiedCode, setHasCopiedCode] = useState(false)
    const [addState, addAction] = useActionState(
        addFriendCoupleByCode,
        EMPTY_FRIEND_STATE
    )
    const [regenerateState, regenerateAction] = useActionState(
        regenerateFriendCode,
        EMPTY_FRIEND_STATE
    )

    const currentFriendCode = regenerateState.friendCode ?? friendCode

    const handleCopyFriendCode = async () => {
        await navigator.clipboard.writeText(currentFriendCode)
        setHasCopiedCode(true)
        window.setTimeout(() => setHasCopiedCode(false), 1800)
    }

    return (
        <div className={styles.panel}>
            <section className={styles.codeCard} aria-labelledby="friend-code-title">
                <div className={styles.codeHeader}>
                    <span className={styles.codeIcon}>
                        <Lock size={18} />
                    </span>
                    <div>
                        <h2 id="friend-code-title">
                            {COUPLE_PLACE_APP_COPY.friendCodeTitle}
                        </h2>
                        <p>{COUPLE_PLACE_APP_COPY.friendCodeDescription}</p>
                    </div>
                </div>

                <strong className={styles.friendCode}>{currentFriendCode}</strong>

                <div className={styles.codeActions}>
                    <Button
                        leftIcon={hasCopiedCode ? <Check size={16} /> : <Copy size={16} />}
                        onClick={handleCopyFriendCode}
                        size="sm"
                        type="button"
                        variant="secondary"
                    >
                        {hasCopiedCode
                            ? COUPLE_PLACE_APP_COPY.friendCodeCopied
                            : COUPLE_PLACE_APP_COPY.copyFriendCode}
                    </Button>
                    <form action={regenerateAction}>
                        <Button
                            leftIcon={<RefreshCw size={16} />}
                            size="sm"
                            type="submit"
                            variant="secondary"
                        >
                            {COUPLE_PLACE_APP_COPY.regenerateFriendCode}
                        </Button>
                    </form>
                </div>

                {regenerateState.errorMessage ? (
                    <FieldMessage variant="error">
                        {regenerateState.errorMessage}
                    </FieldMessage>
                ) : null}
            </section>

            <form action={addAction} className={styles.addForm}>
                <TextField
                    autoComplete="off"
                    inputMode="text"
                    label={COUPLE_PLACE_APP_COPY.addFriendCodeLabel}
                    maxLength={12}
                    name="friendCode"
                    placeholder={COUPLE_PLACE_APP_COPY.addFriendCodePlaceholder}
                />
                <Button size="sm" type="submit">
                    {COUPLE_PLACE_APP_COPY.addFriendCode}
                </Button>
                {addState.errorMessage ? (
                    <FieldMessage variant="error">{addState.errorMessage}</FieldMessage>
                ) : null}
                {addState.succeeded ? (
                    <FieldMessage>{COUPLE_PLACE_APP_COPY.addFriendCodeSuccess}</FieldMessage>
                ) : null}
            </form>

            {friendCouples.length > 0 ? (
                <section className={styles.filterSection} aria-label="친구 커플 필터">
                    {friendCouples.map(friendCouple => (
                        <form
                            action={updateFriendCoupleFilter}
                            key={friendCouple.friendCoupleId}
                        >
                            <input
                                name="friendCoupleId"
                                type="hidden"
                                value={friendCouple.friendCoupleId}
                            />
                            <input
                                name="enabled"
                                type="hidden"
                                value={friendCouple.enabled ? 'false' : 'true'}
                            />
                            <button
                                className={
                                    friendCouple.enabled
                                        ? styles.filterChipActive
                                        : styles.filterChip
                                }
                                type="submit"
                            >
                                <Users size={14} />
                                {friendCouple.friendCoupleName}
                            </button>
                        </form>
                    ))}
                </section>
            ) : null}

            <section className={styles.recommendationList}>
                {recommendations.length > 0 ? (
                    recommendations.map(recommendation => (
                        <article
                            className={styles.recommendationCard}
                            key={recommendation.couplePlaceId}
                        >
                            <div className={styles.photoFrame}>
                                {recommendation.photos[0] ? (
                                    <Image
                                        alt=""
                                        fill
                                        sizes="86px"
                                        src={recommendation.photos[0]}
                                        unoptimized
                                    />
                                ) : (
                                    <Users size={26} />
                                )}
                                <Pill
                                    className={styles.rating}
                                    icon={<Star fill="currentColor" size={12} />}
                                    tone="primary"
                                >
                                    {recommendation.averageRating.toFixed(1)}
                                </Pill>
                            </div>
                            <div className={styles.recommendationBody}>
                                <div className={styles.recommendationHeader}>
                                    <div>
                                        <h3>{recommendation.placeName}</h3>
                                        <p>{recommendation.coupleName}의 추천</p>
                                    </div>
                                    <Badge size="sm" variant="primary">
                                        {CATEGORY_LABEL[recommendation.category]}
                                    </Badge>
                                </div>
                                {recommendation.tags.length > 0 ? (
                                    <div className={styles.tagList}>
                                        {recommendation.tags.slice(0, 3).map(tag => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </article>
                    ))
                ) : (
                    <div className={styles.emptyRecommendations}>
                        <Users size={28} />
                        <strong>{COUPLE_PLACE_APP_COPY.friendEmptyTitle}</strong>
                        <p>{COUPLE_PLACE_APP_COPY.friendEmptyDescription}</p>
                    </div>
                )}
            </section>
        </div>
    )
}
