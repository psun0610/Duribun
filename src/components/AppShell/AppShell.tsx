import type { AppShellProps } from './types/appShell.types'

import styles from './AppShell.module.scss'

export const AppShell = ({ children }: AppShellProps) => {
    return <div className={styles.shell}>{children}</div>
}
