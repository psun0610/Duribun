import { FormCard, formCardStyles } from '@/components/FormCard'
import { saveProfile } from '@/features/profile/actions'

import { AvatarPreviewField } from './AvatarPreviewField'
import type { ProfileSetupFormProps } from './types/profileSetupForm.types'
import { PROFILE_SETUP_COPY } from './const/profileSetupForm.const'

import styles from './ProfileSetupForm.module.scss'

export const ProfileSetupForm = ({ initialValues }: ProfileSetupFormProps) => {
    return (
        <main className={styles.profileSetup}>
            <FormCard
                description={PROFILE_SETUP_COPY.description}
                eyebrow={PROFILE_SETUP_COPY.eyebrow}
                title={PROFILE_SETUP_COPY.title}
                titleId="profile-title"
            >
                <form action={saveProfile} className={formCardStyles.form}>
                    {initialValues.isEmailDisabled ? (
                        <input
                            name="email"
                            type="hidden"
                            value={initialValues.email}
                        />
                    ) : null}
                    <label className={formCardStyles.field}>
                        <span>{PROFILE_SETUP_COPY.emailLabel}</span>
                        <input
                            defaultValue={initialValues.email}
                            disabled={initialValues.isEmailDisabled}
                            name="email"
                            placeholder={PROFILE_SETUP_COPY.emailPlaceholder}
                            required
                            type="email"
                        />
                    </label>
                    <label className={formCardStyles.field}>
                        <span>{PROFILE_SETUP_COPY.displayNameLabel}</span>
                        <input
                            defaultValue={initialValues.displayName}
                            name="displayName"
                            placeholder={
                                PROFILE_SETUP_COPY.displayNamePlaceholder
                            }
                            required
                            type="text"
                        />
                    </label>
                    <AvatarPreviewField
                        fieldClassName={formCardStyles.field}
                        initialAvatarUrl={initialValues.avatarUrl}
                        label={PROFILE_SETUP_COPY.avatarUrlLabel}
                        placeholder={PROFILE_SETUP_COPY.avatarUrlPlaceholder}
                    />
                    <button className={formCardStyles.primaryButton} type="submit">
                        {PROFILE_SETUP_COPY.submitLabel}
                    </button>
                </form>
            </FormCard>
        </main>
    )
}
