'use client'

import { useActionState, useState, type FormEvent } from 'react'

import { FormCard, formCardStyles } from '@/components/FormCard'
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
                        className={formCardStyles.form}
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
                            <p className={styles.errorMessage} role="alert">
                                {formState.errorMessage}
                            </p>
                        ) : null}
                        <button
                            className={formCardStyles.primaryButton}
                            type="submit"
                        >
                            {PROFILE_SETUP_COPY.avatarSubmitLabel}
                        </button>
                    </form>
                ) : (
                    <form
                        className={formCardStyles.form}
                        onSubmit={handleIdentitySubmit}
                    >
                        {initialValues.isEmailDisabled ? (
                            <input name="email" type="hidden" value={email} />
                        ) : null}
                        <label className={formCardStyles.field}>
                            <span>{PROFILE_SETUP_COPY.emailLabel}</span>
                            <input
                                disabled={initialValues.isEmailDisabled}
                                name="email"
                                onChange={event => setEmail(event.target.value)}
                                placeholder={PROFILE_SETUP_COPY.emailPlaceholder}
                                required
                                type="email"
                                value={email}
                            />
                        </label>
                        <label className={formCardStyles.field}>
                            <span>{PROFILE_SETUP_COPY.displayNameLabel}</span>
                            <input
                                name="displayName"
                                onChange={event =>
                                    setDisplayName(event.target.value)
                                }
                                placeholder={
                                    PROFILE_SETUP_COPY.displayNamePlaceholder
                                }
                                required
                                type="text"
                                value={displayName}
                            />
                        </label>
                        {identityErrorMessage ? (
                            <p className={styles.errorMessage} role="alert">
                                {identityErrorMessage}
                            </p>
                        ) : null}
                        <button
                            className={formCardStyles.primaryButton}
                            type="submit"
                        >
                            {PROFILE_SETUP_COPY.identitySubmitLabel}
                        </button>
                    </form>
                )}
            </FormCard>
        </main>
    )
}
