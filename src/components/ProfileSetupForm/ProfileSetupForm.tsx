import { saveProfile } from '@/features/profile/actions'

import type { ProfileSetupFormProps } from './types/profileSetupForm.types'
import { PROFILE_SETUP_COPY } from './const/profileSetupForm.const'

import styles from './ProfileSetupForm.module.scss'

export const ProfileSetupForm = ({ initialValues }: ProfileSetupFormProps) => {
    return (
        <main className={styles.profileSetup}>
            <section className={styles.panel} aria-labelledby="profile-title">
                <p className={styles.eyebrow}>{PROFILE_SETUP_COPY.eyebrow}</p>
                <h1 className={styles.title} id="profile-title">
                    {PROFILE_SETUP_COPY.title}
                </h1>
                <p className={styles.description}>
                    {PROFILE_SETUP_COPY.description}
                </p>
                <form action={saveProfile} className={styles.form}>
                    <label className={styles.field}>
                        <span>{PROFILE_SETUP_COPY.emailLabel}</span>
                        <input
                            defaultValue={initialValues.email}
                            name="email"
                            placeholder={PROFILE_SETUP_COPY.emailPlaceholder}
                            required
                            type="email"
                        />
                    </label>
                    <label className={styles.field}>
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
                    <label className={styles.field}>
                        <span>{PROFILE_SETUP_COPY.avatarUrlLabel}</span>
                        <input
                            defaultValue={initialValues.avatarUrl}
                            name="avatarUrl"
                            placeholder={PROFILE_SETUP_COPY.avatarUrlPlaceholder}
                            type="url"
                        />
                    </label>
                    <button className={styles.submitButton} type="submit">
                        {PROFILE_SETUP_COPY.submitLabel}
                    </button>
                </form>
            </section>
        </main>
    )
}
