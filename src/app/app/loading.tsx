import styles from './loading.module.scss'

const PLACEHOLDER_CARD_COUNT = 6

/**
 * /app 아래 모든 화면이 이 자리표시를 씁니다.
 * Suspense 경계가 없으면 서버가 끝날 때까지 화면이 통째로 멈춰 있습니다.
 */
const AppLoading = () => {
    return (
        <div aria-busy="true" className={styles.loading}>
            <div className={styles.headerBar}>
                <span className={`${styles.block} ${styles.headerLine}`} />
            </div>

            <div className={styles.toolbarRow}>
                <span className={`${styles.block} ${styles.countLine}`} />
                <span className={`${styles.block} ${styles.toggleLine}`} />
            </div>

            <div className={styles.grid}>
                {Array.from({ length: PLACEHOLDER_CARD_COUNT }, (_, index) => (
                    <div className={styles.card} key={index}>
                        <span className={`${styles.block} ${styles.photo}`} />
                        <span
                            className={`${styles.block} ${styles.titleLine}`}
                        />
                        <span className={`${styles.block} ${styles.tagLine}`} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AppLoading
