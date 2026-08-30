import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { FieldMessage } from '@/components/ui'
import { signInWithEmail, signInWithProvider } from '@/features/auth/actions'

import type { LoginPanelProps } from './types/loginPanel.types'
import { LOGIN_PANEL_COPY, LOGIN_PROVIDERS } from './const/loginPanel.const'

import styles from './LoginPanel.module.scss'

export const LoginPanel = ({
    hasAuthError = false,
    hasEmailSent = false,
    next = '/app',
}: LoginPanelProps) => {
    return (
        <main className={styles.login}>
            <div className={styles.navBar}>
                <Link
                    aria-label={LOGIN_PANEL_COPY.backLabel}
                    className={styles.backLink}
                    href="/"
                >
                    <ChevronLeft aria-hidden="true" size={21} />
                </Link>
            </div>

            <section className={styles.content} aria-labelledby="login-title">
                <h1 className={styles.title} id="login-title">
                    {LOGIN_PANEL_COPY.title}
                </h1>
                <p className={styles.description}>
                    {LOGIN_PANEL_COPY.description}
                </p>

                <div className={styles.providerList}>
                    {LOGIN_PROVIDERS.map(provider => (
                        <form action={signInWithProvider} key={provider.value}>
                            <input
                                name="provider"
                                type="hidden"
                                value={provider.value}
                            />
                            <input name="next" type="hidden" value={next} />
                            <button
                                className={`${styles.providerButton} ${
                                    styles[provider.value]
                                }`}
                                type="submit"
                            >
                                <span className={styles.providerIcon}>
                                    <Image
                                        alt={provider.iconAlt}
                                        height="22"
                                        src={provider.iconSrc}
                                        width="22"
                                    />
                                </span>
                                {provider.label}
                            </button>
                        </form>
                    ))}
                </div>

                <div className={styles.divider} role="presentation">
                    <span>{LOGIN_PANEL_COPY.emailDividerLabel}</span>
                </div>

                <form action={signInWithEmail} className={styles.emailForm}>
                    <input name="next" type="hidden" value={next} />
                    <input
                        aria-label={LOGIN_PANEL_COPY.emailLabel}
                        className={styles.emailInput}
                        name="email"
                        placeholder={LOGIN_PANEL_COPY.emailPlaceholder}
                        required
                        type="email"
                    />
                    <button className={styles.emailButton} type="submit">
                        {LOGIN_PANEL_COPY.emailSubmitLabel}
                    </button>
                    {hasEmailSent ? (
                        <FieldMessage>
                            {LOGIN_PANEL_COPY.emailSentMessage}
                        </FieldMessage>
                    ) : null}
                    {hasAuthError ? (
                        <FieldMessage variant="error">
                            {LOGIN_PANEL_COPY.authErrorMessage}
                        </FieldMessage>
                    ) : null}
                </form>

                <p className={styles.accountHint}>
                    {LOGIN_PANEL_COPY.accountHint}
                </p>
            </section>
        </main>
    )
}
