import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

import {
    Button,
    FieldMessage,
    TextField,
} from '@/components/ui'
import { signInWithEmail, signInWithProvider } from '@/features/auth/actions'

import type { LoginPanelProps } from './types/loginPanel.types'
import { LOGIN_PANEL_COPY, LOGIN_PROVIDERS } from './const/loginPanel.const'

import styles from './LoginPanel.module.scss'

export const LoginPanel = ({
    hasEmailSent = false,
    next = '/app',
}: LoginPanelProps) => {
    return (
        <main className={styles.login}>
            <section className={styles.content} aria-labelledby="login-title">
                <div className={styles.brandBlock}>
                    <h1 className={styles.logo} id="login-title">
                        두리번
                    </h1>
                    <p className={styles.title}>
                        우리만의 장소를
                        <br />
                        <strong>함께</strong> 모아봐요
                    </p>
                </div>
                <div
                    aria-label={LOGIN_PANEL_COPY.heroImageLabel}
                    className={styles.heroImage}
                    role="img"
                />
                <div className={styles.providerList}>
                    {LOGIN_PROVIDERS.map(provider => (
                        <form action={signInWithProvider} key={provider.value}>
                            <input
                                name="provider"
                                type="hidden"
                                value={provider.value}
                            />
                            <input name="next" type="hidden" value={next} />
                            <Button
                                className={`${styles.providerButton} ${
                                    styles[provider.value]
                                }`}
                                leftIcon={
                                    <Image
                                        alt={provider.iconAlt}
                                        height="22"
                                        src={provider.iconSrc}
                                        width="22"
                                    />
                                }
                                type="submit"
                                variant="secondary"
                            >
                                {provider.label}
                            </Button>
                        </form>
                    ))}
                </div>
                <form action={signInWithEmail} className={styles.emailForm}>
                    <input name="next" type="hidden" value={next} />
                    <TextField
                        className={styles.emailField}
                        label={LOGIN_PANEL_COPY.emailLabel}
                        name="email"
                        placeholder={LOGIN_PANEL_COPY.emailPlaceholder}
                        required
                        type="email"
                    />
                    <Button type="submit">
                        {LOGIN_PANEL_COPY.emailSubmitLabel}
                    </Button>
                    {hasEmailSent ? (
                        <FieldMessage>
                            {LOGIN_PANEL_COPY.emailSentMessage}
                        </FieldMessage>
                    ) : null}
                </form>
                <p className={styles.accountHint}>
                    {LOGIN_PANEL_COPY.accountHint}
                    <ChevronRight aria-hidden="true" size={15} />
                </p>
            </section>
        </main>
    )
}
