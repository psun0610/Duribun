import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
    title: '두리번',
    description: '커플 전용 추억 지도',
}

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="ko">
            <body className="min-h-dvh antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}

export default RootLayout
