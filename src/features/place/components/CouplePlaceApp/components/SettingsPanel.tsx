import { Lock } from 'lucide-react'

import { Button, EmptyState } from '@/components/ui'
import { signOut } from '@/features/auth/actions'
import { requestCoupleDisconnect } from '@/features/couple/actions'

import { COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'
import styles from './SettingsPanel.module.scss'

export const SettingsPanel = () => {
    return (
        <EmptyState
            action={
                <div className={styles.stack}>
                    <form action={signOut}>
                        <Button className={styles.fullWidth} type="submit" variant="secondary">
                            {COUPLE_PLACE_APP_COPY.logout}
                        </Button>
                    </form>
                    <form action={requestCoupleDisconnect}>
                        <Button className={styles.fullWidth} type="submit" variant="secondary">
                            {COUPLE_PLACE_APP_COPY.requestDisconnect}
                        </Button>
                    </form>
                </div>
            }
            description={COUPLE_PLACE_APP_COPY.settingsDescription}
            icon={<Lock strokeWidth={2.5} />}
            title={COUPLE_PLACE_APP_COPY.settingsTitle}
        />
    )
}
