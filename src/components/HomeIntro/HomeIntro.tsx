import Link from 'next/link'

import {
    HOME_ACTIONS,
    HOME_MEMORY_META,
    HOME_PREVIEW_IMAGES,
} from './const/homeIntro.const'

import styles from './HomeIntro.module.scss'

export const HomeIntro = () => {
    return (
        <main className={styles.home}>
            <section className={styles.hero} aria-labelledby="home-title">
                <div className={styles.copy}>
                    <p className={styles.eyebrow}>
                        Modern couple archive: DURIBUN
                    </p>
                    <h1 className={styles.title} id="home-title">
                        우리의 데이트 기록 시작하기
                    </h1>
                    <p className={styles.description}>
                        함께 다녀온 장소, 사진, 평점, 리뷰 상태를 한 화면에서
                        보고 친구 커플에게 공유할 추천도 따로 관리해요.
                    </p>
                    <div className={styles.actions}>
                        {HOME_ACTIONS.map(action => (
                            <Link
                                className={styles[action.variant]}
                                href={action.href}
                                key={action.label}
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <article className={styles.memoryCard}>
                    <div
                        className={styles.photoGrid}
                        aria-label="장소 사진 미리보기"
                    >
                        {HOME_PREVIEW_IMAGES.map(image => (
                            <div
                                aria-label={image.label}
                                className={styles[image.variant]}
                                key={image.label}
                                role="img"
                                style={{ backgroundImage: `url(${image.url})` }}
                            />
                        ))}
                    </div>
                    <div className={styles.memoryMeta}>
                        <span>{HOME_MEMORY_META.category}</span>
                        <strong>{HOME_MEMORY_META.placeName}</strong>
                        <span>{HOME_MEMORY_META.status}</span>
                    </div>
                </article>
            </section>
        </main>
    )
}
