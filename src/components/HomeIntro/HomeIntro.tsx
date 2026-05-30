import Link from 'next/link';

import {
    HOME_ACTIONS,
    HOME_MEMORY_META,
    HOME_PREVIEW_IMAGES,
} from './const/homeIntro.const';

import styles from './HomeIntro.module.scss';

export const HomeIntro = () => {
    return (
        <main className={styles.home}>
            <section className={styles.hero} aria-labelledby="home-title">
                <div className={styles.copy}>
                    <p className={styles.eyebrow}>Private photo journal</p>
                    <h1 className={styles.title} id="home-title">
                        둘이 쌓아가는 장소의 기억
                    </h1>
                    <p className={styles.description}>
                        함께 다녀온 장소, 사진, 평점, 둘만의 메모를 조용히 모아두고
                        공유 가능한 추천만 신중하게 꺼냅니다.
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
                    <div className={styles.photoGrid} aria-label="장소 사진 미리보기">
                        {HOME_PREVIEW_IMAGES.map(image => (
                            <div
                                aria-label={image.label}
                                className={styles[image.variant]}
                                key={image.label}
                                role="img"
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
    );
};
