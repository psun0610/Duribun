import { Lock } from 'lucide-react'

import { Button } from '@/components/ui'
import { signOut } from '@/features/auth/actions'
import { requestCoupleDisconnect } from '@/features/couple/actions'

import { COUPLE_PLACE_APP_COPY } from '../const/couplePlaceApp.const'

export const SettingsPanel = () => {
    return (
        <section className="space-y-5 py-20 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-secondary shadow-2xl">
                <Lock className="h-12 w-12 text-white" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold">
                    {COUPLE_PLACE_APP_COPY.settingsTitle}
                </h2>
                <p className="mx-auto max-w-xs text-[15px] font-normal leading-6 text-muted-foreground">
                    {COUPLE_PLACE_APP_COPY.settingsDescription}
                </p>
            </div>
            <form action={signOut}>
                <Button type="submit" variant="secondary">
                    {COUPLE_PLACE_APP_COPY.logout}
                </Button>
            </form>
            <form action={requestCoupleDisconnect}>
                <Button type="submit" variant="secondary">
                    {COUPLE_PLACE_APP_COPY.requestDisconnect}
                </Button>
            </form>
        </section>
    )
}
