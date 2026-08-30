import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'

import { AppShell } from '@/components/AppShell'

import '@/styles/globals.scss'

// 디자인 시스템 v2.1의 유일한 서체입니다. 굵기도 400/500/700/800만 씁니다.
const notoSansKr = Noto_Sans_KR({
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-app',
    weight: ['400', '500', '700', '800'],
})

export const metadata: Metadata = {
    title: '두리번',
    description: '둘이 다녀온 곳을 모아두는 커플 기록장',
}

type RootLayoutProps = Readonly<{
    children: React.ReactNode
}>

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <html className={notoSansKr.variable} lang="ko">
            <body>
                <AppShell>{children}</AppShell>
            </body>
        </html>
    )
}

export default RootLayout
