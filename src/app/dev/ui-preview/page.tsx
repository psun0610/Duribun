import { notFound } from 'next/navigation'

import { PreviewClient } from './PreviewClient'

interface UiPreviewPageProps {
    searchParams: Promise<{ screen?: string }>
}

/**
 * 로그인 없이 화면만 확인하기 위한 임시 경로입니다.
 * 개발 서버에서만 열리고, 배포 빌드에서는 404가 됩니다.
 */
const UiPreviewPage = async ({ searchParams }: UiPreviewPageProps) => {
    if (process.env.NODE_ENV !== 'development') {
        notFound()
    }

    const { screen } = await searchParams

    return <PreviewClient screen={screen ?? 'places-feed'} />
}

export default UiPreviewPage
