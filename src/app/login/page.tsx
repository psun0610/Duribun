import { LoginPanel } from '@/features/auth/components/LoginPanel'

interface LoginPageProps {
    searchParams: Promise<{
        emailSent?: string
        next?: string
    }>
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
    const resolvedSearchParams = await searchParams

    return (
        <LoginPanel
            hasEmailSent={resolvedSearchParams.emailSent === '1'}
            next={resolvedSearchParams.next}
        />
    )
}

export default LoginPage
