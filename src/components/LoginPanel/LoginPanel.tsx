import Image from 'next/image'

import { signInWithEmail, signInWithProvider } from '@/features/auth/actions'

import type { LoginPanelProps } from './types/loginPanel.types'
import { LOGIN_PANEL_COPY, LOGIN_PROVIDERS } from './const/loginPanel.const'

import styles from './LoginPanel.module.scss'

export const LoginPanel = ({ hasEmailSent = false }: LoginPanelProps) => {
    return (
        <main className={styles.login}>
            <section className={styles.panel} aria-labelledby="login-title">
                <p className={styles.eyebrow}>{LOGIN_PANEL_COPY.eyebrow}</p>
                <h1 className={styles.title} id="login-title">
                    {LOGIN_PANEL_COPY.title}
                </h1>
                <p className={styles.description}>
                    {LOGIN_PANEL_COPY.description}
                </p>
                <form action={signInWithEmail} className={styles.emailForm}>
                    <label className={styles.emailField}>
                        <span>{LOGIN_PANEL_COPY.emailLabel}</span>
                        <input
                            name="email"
                            placeholder={LOGIN_PANEL_COPY.emailPlaceholder}
                            required
                            type="email"
                        />
                    </label>
                    <button className={styles.emailButton} type="submit">
                        {LOGIN_PANEL_COPY.emailSubmitLabel}
                    </button>
                    {hasEmailSent ? (
                        <p className={styles.emailSentMessage}>
                            {LOGIN_PANEL_COPY.emailSentMessage}
                        </p>
                    ) : null}
                </form>
                <div className={styles.socialDivider}>
                    <span>{LOGIN_PANEL_COPY.socialLabel}</span>
                </div>
                <div className={styles.providerList}>
                    {LOGIN_PROVIDERS.map(provider => (
                        <form action={signInWithProvider} key={provider.value}>
                            <input
                                name="provider"
                                type="hidden"
                                value={provider.value}
                            />
                            <button
                                aria-label={provider.label}
                                className={styles.providerButton}
                                title={provider.label}
                                type="submit"
                            >
                                <Image
                                    alt={provider.iconAlt}
                                    height="28"
                                    src={provider.iconSrc}
                                    width="28"
                                />
                            </button>
                        </form>
                    ))}
                </div>
                {/* <p className={styles.accountHint}>
                    {LOGIN_PANEL_COPY.accountHint}
                </p> */}
            </section>
        </main>
    )
}
