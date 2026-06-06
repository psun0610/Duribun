import Link from 'next/link'
import type { AppShellProps } from './types/appShell.types'
import styles from './AppShell.module.scss'

export const AppShell = ({ children }: AppShellProps) => {
    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <Link className={styles.brand} href="/">
                    두리번
                </Link>
                <Link className={styles.privateLink} href="/app">
                    우리 공간
                </Link>
            </header>
            {children}
        </div>
    )
}
