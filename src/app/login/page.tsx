import { LoginPanel } from '@/features/auth/components/LoginPanel'

interface LoginPageProps {
    searchParams: Promise<{
        emailSent?: string
    }>
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
    const resolvedSearchParams = await searchParams

    return <LoginPanel hasEmailSent={resolvedSearchParams.emailSent === '1'} />
}

export default LoginPage
