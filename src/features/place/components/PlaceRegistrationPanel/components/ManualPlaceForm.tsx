import { Button, FieldMessage, Spinner } from '@/components/ui'

import {
    PLACE_CATEGORY_OPTIONS,
    PLACE_REGISTRATION_COPY,
} from '../const/placeRegistrationPanel.const'
import type { ManualPlaceFormProps } from '../types/placeRegistrationPanel.types'

import styles from '../PlaceRegistrationPanel.module.scss'

export const ManualPlaceForm = ({
    isRegisteringManualPlace,
    manualRegistrationState,
    registerManualAction,
}: ManualPlaceFormProps) => {
    return (
        <form action={registerManualAction} className={styles.manualForm}>
            <h3>{PLACE_REGISTRATION_COPY.manualTitle}</h3>
            <input
                className={styles.input}
                disabled={isRegisteringManualPlace}
                name="name"
                placeholder={PLACE_REGISTRATION_COPY.manualNamePlaceholder}
                required
            />
            <select
                className={styles.select}
                disabled={isRegisteringManualPlace}
                name="category"
            >
                {PLACE_CATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <input
                className={styles.input}
                disabled={isRegisteringManualPlace}
                name="address"
                placeholder={PLACE_REGISTRATION_COPY.addressPlaceholder}
            />
            <Button disabled={isRegisteringManualPlace} type="submit">
                {isRegisteringManualPlace ? (
                    <span className={styles.buttonContent}>
                        <Spinner />
                        {PLACE_REGISTRATION_COPY.registering}
                    </span>
                ) : (
                    PLACE_REGISTRATION_COPY.manualRegister
                )}
            </Button>
            {manualRegistrationState.errorMessage ? (
                <FieldMessage variant="error">
                    {manualRegistrationState.errorMessage}
                </FieldMessage>
            ) : null}
        </form>
    )
}
