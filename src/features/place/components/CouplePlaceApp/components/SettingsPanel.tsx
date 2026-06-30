import {
    Bell,
    ChevronRight,
    Database,
    Globe2,
    HelpCircle,
    Lock,
    ShieldCheck,
    Users,
} from 'lucide-react'

import { Button } from '@/components/ui'
import { signOut } from '@/features/auth/actions'
import { requestCoupleDisconnect } from '@/features/couple/actions'

import { COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'
import type { SettingsPanelProps } from '../types/couplePlaceAppComponent.types'

import styles from './SettingsPanel.module.scss'

export const SettingsPanel = ({
    coupleName,
    friendCoupleCount,
    publicPlaceCount,
    userLabel,
}: SettingsPanelProps) => {
    return (
        <div className={styles.panel}>
            <section className={styles.profileCard}>
                <div className={styles.avatar}>
                    {userLabel.slice(0, 1).toUpperCase()}
                </div>
                <div className={styles.profileText}>
                    <strong>{coupleName}</strong>
                    <span>{userLabel}</span>
                </div>
                <ChevronRight aria-hidden="true" size={18} />
            </section>

            <section className={styles.menuGroup} aria-label="설정 메뉴">
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <Lock size={17} />
                    </span>
                    <span>공개한 장소</span>
                    <strong>{publicPlaceCount}</strong>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <Users size={17} />
                    </span>
                    <span>친구 관리</span>
                    <strong>{friendCoupleCount}</strong>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <ShieldCheck size={17} />
                    </span>
                    <span>커플 관리</span>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <Bell size={17} />
                    </span>
                    <span>알림 설정</span>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
            </section>

            <section className={styles.shareGuide} aria-label="공유 기준 안내">
                <h2>공유 기준 안내</h2>
                <p>
                    공개로 설정한 장소만 친구 추천과 탐색에 노출돼요. 공개해도
                    한 줄 리뷰와 개인 평점은 밖으로 나가지 않아요.
                </p>
                <div className={styles.shareCards}>
                    <article className={styles.publicCard}>
                        <Globe2 size={30} />
                        <strong>공개 가능</strong>
                        <ul>
                            <li>탐색 탭에 노출</li>
                            <li>친구 추천에 노출</li>
                            <li>장소/음식 사진만 공유</li>
                        </ul>
                    </article>
                    <article className={styles.privateCard}>
                        <Lock size={30} />
                        <strong>비공개</strong>
                        <ul>
                            <li>탐색 탭에 노출 안됨</li>
                            <li>친구 추천에 숨김</li>
                            <li>공유 범위 내가 결정</li>
                        </ul>
                    </article>
                </div>
            </section>

            <section className={styles.menuGroup} aria-label="데이터 관리">
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <Database size={17} />
                    </span>
                    <span>내 데이터 관리</span>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <HelpCircle size={17} />
                    </span>
                    <span>자주 묻는 질문</span>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
            </section>

            <div className={styles.actionStack}>
                <form action={signOut}>
                    <Button className={styles.fullWidth} size="sm" type="submit" variant="secondary">
                        {COUPLE_PLACE_APP_COPY.logout}
                    </Button>
                </form>
                <form action={requestCoupleDisconnect}>
                    <Button className={styles.fullWidth} size="sm" type="submit" variant="secondary">
                        {COUPLE_PLACE_APP_COPY.requestDisconnect}
                    </Button>
                </form>
            </div>
        </div>
    )
}
