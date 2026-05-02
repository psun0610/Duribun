import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/styles/globals.css'

export const metadata: Metadata = {
    title: '두리번',
    description: '커플 전용 추억 지도',
}

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="ko">
            <body className="min-h-dvh antialiased">{children}</body>
        </html>
    )
}

export default RootLayout
