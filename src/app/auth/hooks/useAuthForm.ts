'use client'

import { useState } from 'react'
import { signUp, signIn } from '../api'

export const useAuthForm = (onAuthSuccess: () => void) => {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (isSignUp) {
                await signUp(email, password, name)
            } else {
                await signIn(email, password)
            }
            onAuthSuccess()
        } catch (err: unknown) {
            setError((err as Error).message || '로그인에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    return {
        isSignUp,
        setIsSignUp,
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        loading,
        error,
        handleSubmit,
    }
}
