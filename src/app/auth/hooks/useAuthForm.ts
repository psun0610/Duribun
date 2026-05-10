'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { signUp, signIn } from '../api'

export const useAuthForm = (onAuthSuccess: () => void) => {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            if (isSignUp) {
                await signUp(email, password, name)
            } else {
                await signIn(email, password)
            }
        },
        onSuccess: () => onAuthSuccess(),
        onError: (err: Error) => {
            setError(err.message || '로그인에 실패했습니다')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        mutate()
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
        loading: isPending,
        error,
        handleSubmit,
    }
}
