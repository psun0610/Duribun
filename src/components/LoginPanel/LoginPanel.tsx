import { signInWithProvider } from '@/features/auth/actions';

import { LOGIN_PROVIDERS } from './const/loginPanel.const';

import styles from './LoginPanel.module.scss';

export const LoginPanel = () => {
    return (
        <main className={styles.login}>
            <section className={styles.panel} aria-labelledby="login-title">
                <p className={styles.eyebrow}>Sign in</p>
                <h1 className={styles.title} id="login-title">
                    조용히 이어서 기록하기
                </h1>
                <p className={styles.description}>
                    사용하는 계정으로 로그인하고 둘만의 장소 아카이브로 돌아갑니다.
                </p>
                <div className={styles.providerList}>
                    {LOGIN_PROVIDERS.map(provider => (
                        <form action={signInWithProvider} key={provider.value}>
                            <input
                                name="provider"
                                type="hidden"
                                value={provider.value}
                            />
                            <button className={styles.providerButton} type="submit">
                                <span>{provider.label}</span>
                                <small>{provider.description}</small>
                            </button>
                        </form>
                    ))}
                </div>
            </section>
        </main>
    );
};
