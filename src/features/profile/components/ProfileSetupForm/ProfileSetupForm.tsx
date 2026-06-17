'use client'

import { useActionState, useState, type FormEvent } from 'react'

import { Button, FieldMessage, FormCard, TextField } from '@/components/ui'
import { saveProfileWithAvatar } from '@/features/profile/actions'
import type { ProfileFormState } from '@/features/profile/types/profileAction.types'

import { AvatarFileField } from './AvatarFileField'
import type { ProfileSetupFormProps } from './types/profileSetupForm.types'
import { PROFILE_SETUP_COPY } from './const/profileSetupForm.const'

import styles from './ProfileSetupForm.module.scss'

export const ProfileSetupForm = ({ initialValues }: ProfileSetupFormProps) => {
    const initialFormState: ProfileFormState = {
        avatarUrl: initialValues.avatarUrl,
        errorMessage: '',
    }
    const [formState, formAction] = useActionState(
        saveProfileWithAvatar,
        initialFormState
    )
    const [step, setStep] = useState<'identity' | 'avatar'>('identity')
    const [email, setEmail] = useState(initialValues.email)
    const [displayName, setDisplayName] = useState(initialValues.displayName)
    const [identityErrorMessage, setIdentityErrorMessage] = useState('')
    const isAvatarStep = step === 'avatar'

    const handleIdentitySubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextEmail = email.trim()
        const nextDisplayName = displayName.trim()

        if (!nextEmail) {
            setIdentityErrorMessage('이메일을 입력해 주세요.')
            return
        }

        if (!nextDisplayName) {
            setIdentityErrorMessage('닉네임을 입력해 주세요.')
            return
        }

        setEmail(nextEmail)
        setDisplayName(nextDisplayName)
        setIdentityErrorMessage('')
        setStep('avatar')
    }

    return (
        <main className={styles.profileSetup}>
            <FormCard
                description={
                    isAvatarStep
                        ? PROFILE_SETUP_COPY.avatarDescription
                        : PROFILE_SETUP_COPY.description
                }
                eyebrow={PROFILE_SETUP_COPY.eyebrow}
                title={PROFILE_SETUP_COPY.title}
                titleId="profile-title"
            >
                {isAvatarStep ? (
                    <form
                        action={formAction}
                        className={styles.form}
                        encType="multipart/form-data"
                    >
                        <input name="email" type="hidden" value={email} />
                        <input
                            name="displayName"
                            type="hidden"
                            value={displayName}
                        />
                        <AvatarFileField
                            initialAvatarUrl={formState.avatarUrl}
                            inputId="avatarFile"
                            label={PROFILE_SETUP_COPY.avatarLabel}
                        />
                        {formState.errorMessage ? (
                            <FieldMessage variant="error" role="alert">
                                {formState.errorMessage}
                            </FieldMessage>
                        ) : null}
                        <Button type="submit">
                            {PROFILE_SETUP_COPY.avatarSubmitLabel}
                        </Button>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={handleIdentitySubmit}>
                        {initialValues.isEmailDisabled ? (
                            <input name="email" type="hidden" value={email} />
                        ) : null}
                        <TextField
                            disabled={initialValues.isEmailDisabled}
                            label={PROFILE_SETUP_COPY.emailLabel}
                            name="email"
                            onChange={event => setEmail(event.target.value)}
                            placeholder={PROFILE_SETUP_COPY.emailPlaceholder}
                            required
                            type="email"
                            value={email}
                        />
                        <TextField
                            label={PROFILE_SETUP_COPY.displayNameLabel}
                            name="displayName"
                            onChange={event => setDisplayName(event.target.value)}
                            placeholder={
                                PROFILE_SETUP_COPY.displayNamePlaceholder
                            }
                            required
                            type="text"
                            value={displayName}
                        />
                        {identityErrorMessage ? (
                            <FieldMessage variant="error" role="alert">
                                {identityErrorMessage}
                            </FieldMessage>
                        ) : null}
                        <Button type="submit">
                            {PROFILE_SETUP_COPY.identitySubmitLabel}
                        </Button>
                    </form>
                )}
            </FormCard>
        </main>
    )
}
