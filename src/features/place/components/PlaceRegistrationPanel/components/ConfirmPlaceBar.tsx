import { Button, FieldMessage, Spinner } from '@/components/ui'

import { PLACE_REGISTRATION_COPY } from '../const/placeRegistrationPanel.const'
import type { ConfirmPlaceBarProps } from '../types/placeRegistrationPanel.types'

import styles from '../PlaceRegistrationPanel.module.scss'

export const ConfirmPlaceBar = ({
    confirmedPlace,
    isRegisteringKakaoPlace,
    kakaoRegistrationState,
    onClearSelectedPlace,
    registerKakaoAction,
}: ConfirmPlaceBarProps) => {
    return (
        <form action={registerKakaoAction} className={styles.confirmBar}>
            <input
                name="providerPlaceId"
                type="hidden"
                value={confirmedPlace.id}
            />
            <input name="name" type="hidden" value={confirmedPlace.name} />
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
                <FieldMessage variant="error">
                    {kakaoRegistrationState.errorMessage}
                </FieldMessage>
            ) : null}
            <div className={styles.confirmActions}>
                <Button
                    disabled={isRegisteringKakaoPlace}
                    onClick={onClearSelectedPlace}
                    type="button"
                    variant="secondary"
                >
                    {PLACE_REGISTRATION_COPY.selectAnother}
                </Button>
                <Button disabled={isRegisteringKakaoPlace} type="submit">
                    {isRegisteringKakaoPlace ? (
                        <span className={styles.buttonContent}>
                            <Spinner />
                            {PLACE_REGISTRATION_COPY.registering}
                        </span>
                    ) : (
                        PLACE_REGISTRATION_COPY.submitSelectedPlace
                    )}
                </Button>
            </div>
        </form>
    )
}
