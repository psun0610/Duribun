import { signOut } from '@/features/auth/actions';

import type { ProtectedSpaceProps } from './types/protectedSpace.types';

import styles from './ProtectedSpace.module.scss';

export const ProtectedSpace = ({ userLabel }: ProtectedSpaceProps) => {
    return (
        <main className={styles.space}>
            <section className={styles.panel} aria-labelledby="space-title">
                <div className={styles.photoPlaceholder} aria-hidden="true" />
                <p className={styles.eyebrow}>Private archive</p>
                <h1 className={styles.title} id="space-title">
                    내 공간
                </h1>
                <p className={styles.description}>
                    현재 세션은 {userLabel} 계정으로 인증되어 있습니다.
                </p>
                <form action={signOut}>
                    <button className={styles.signOutButton} type="submit">
                        로그아웃
                    </button>
                </form>
            </section>
        </main>
    );
};
