'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { Button, FieldMessage, ProgressDots } from '@/components/ui'
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
    const [formState, formAction, isSaving] = useActionState(
        saveProfileWithAvatar,
        initialFormState
    )

    return (
        <main className={styles.profileSetup}>
            <div className={styles.navBar}>
                <Link
                    aria-label={PROFILE_SETUP_COPY.backLabel}
                    className={styles.backLink}
                    href="/login"
                >
                    <ChevronLeft aria-hidden="true" size={21} />
                </Link>
                <ProgressDots
                    activeIndex={0}
                    className={styles.progressDots}
                    count={3}
                />
                <span aria-hidden="true" className={styles.navSpacer} />
            </div>

            <section aria-labelledby="profile-title" className={styles.content}>
                <h1 className={styles.title} id="profile-title">
                    {PROFILE_SETUP_COPY.title}
                </h1>
                <p className={styles.description}>
                    {PROFILE_SETUP_COPY.description}
                </p>

                <form
                    action={formAction}
                    className={styles.form}
                    encType="multipart/form-data"
                >
                    <div className={styles.avatarArea}>
                        <AvatarFileField
                            initialAvatarUrl={formState.avatarUrl}
                            inputId="avatarFile"
                            label={PROFILE_SETUP_COPY.avatarLabel}
                        />
                        <p className={styles.avatarCaption}>
                            {PROFILE_SETUP_COPY.avatarCaption}
                        </p>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label
                            className={styles.fieldLabel}
                            htmlFor="profile-display-name"
                        >
                            {PROFILE_SETUP_COPY.displayNameLabel}
                        </label>
                        <input
                            className={styles.fieldInput}
                            defaultValue={initialValues.displayName}
                            id="profile-display-name"
                            name="displayName"
                            placeholder={
                                PROFILE_SETUP_COPY.displayNamePlaceholder
                            }
                            required
                            type="text"
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <div className={styles.fieldLabelRow}>
                            <label
                                className={styles.fieldLabel}
                                htmlFor="profile-email"
                            >
                                {PROFILE_SETUP_COPY.emailLabel}
                            </label>
                            <span className={styles.fieldHint}>
                                {PROFILE_SETUP_COPY.emailHint}
                            </span>
                        </div>
                        <input
                            className={styles.fieldInput}
                            defaultValue={initialValues.email}
                            disabled={initialValues.isEmailDisabled}
                            id="profile-email"
                            name="email"
                            placeholder={PROFILE_SETUP_COPY.emailPlaceholder}
                            required
                            type="email"
                        />
                        {initialValues.isEmailDisabled ? (
                            <input
                                name="email"
                                type="hidden"
                                value={initialValues.email}
                            />
                        ) : null}
                    </div>

                    {formState.errorMessage ? (
                        <FieldMessage role="alert" variant="error">
                            {formState.errorMessage}
                        </FieldMessage>
                    ) : null}

                    <div className={styles.submitArea}>
                        <Button
                            disabled={isSaving}
                            isLoading={isSaving}
                            type="submit"
                        >
                            {PROFILE_SETUP_COPY.submitLabel}
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    )
}
