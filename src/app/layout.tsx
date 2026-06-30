import type { Metadata } from 'next'

import { AppShell } from '@/components/AppShell'

import '@/styles/globals.scss'

export const metadata: Metadata = {
    title: 'Duribun',
    description: 'Private place reviews for couples.',
}

type RootLayoutProps = Readonly<{
    children: React.ReactNode
}>

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <html lang="ko">
            <body>
                <AppShell>{children}</AppShell>
            </body>
        </html>
    )
}

export default RootLayout
