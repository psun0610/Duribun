import { Button, FieldMessage, SelectField, TextField } from '@/components/ui'

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
            <TextField
                disabled={isRegisteringManualPlace}
                label={PLACE_REGISTRATION_COPY.manualNameLabel}
                name="name"
                placeholder={PLACE_REGISTRATION_COPY.manualNamePlaceholder}
                required
            />
            <SelectField
                disabled={isRegisteringManualPlace}
                label={PLACE_REGISTRATION_COPY.categoryLabel}
                name="category"
            >
                {PLACE_CATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </SelectField>
            <TextField
                disabled={isRegisteringManualPlace}
                label={PLACE_REGISTRATION_COPY.addressLabel}
                name="address"
                placeholder={PLACE_REGISTRATION_COPY.addressPlaceholder}
            />
            <Button
                disabled={isRegisteringManualPlace}
                isLoading={isRegisteringManualPlace}
                type="submit"
            >
                {isRegisteringManualPlace
                    ? PLACE_REGISTRATION_COPY.registering
                    : PLACE_REGISTRATION_COPY.manualRegister}
            </Button>
            {manualRegistrationState.errorMessage ? (
                <FieldMessage variant="error">
                    {manualRegistrationState.errorMessage}
                </FieldMessage>
            ) : null}
        </form>
    )
}
