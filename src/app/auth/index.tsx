'use client'

import { useState } from 'react'
import { supabase, apiCall } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { motion } from 'motion/react'
import { Heart } from 'lucide-react'

interface AuthPageProps {
    onAuthSuccess: () => void
}

export const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
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
                await apiCall('/auth/signup', {
                    method: 'POST',
                    body: JSON.stringify({ email, password, name }),
                })
                const { error: signInError } =
                    await supabase.auth.signInWithPassword({ email, password })
                if (signInError) throw signInError
            } else {
                const { error: signInError } =
                    await supabase.auth.signInWithPassword({ email, password })
                if (signInError) throw signInError
            }
            onAuthSuccess()
        } catch (err: unknown) {
            setError((err as Error).message || '로그인에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                            className="inline-block mb-4"
                        >
                            <Heart className="w-16 h-16 text-primary fill-primary" />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            두리번
                        </h1>
                        <p className="text-muted-foreground">
                            커플 전용 추억 지도
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp && (
                            <div className="grid gap-2">
                                <Label htmlFor="auth-name">이름</Label>
                                <Input
                                    id="auth-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="홍길동"
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="auth-email">이메일</Label>
                            <Input
                                id="auth-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="example@email.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="auth-password">비밀번호</Label>
                            <Input
                                id="auth-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="text-destructive text-sm text-center">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            variant="default"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading
                                ? '처리 중...'
                                : isSignUp
                                  ? '회원가입'
                                  : '로그인'}
                        </Button>

                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {isSignUp ? (
                                <>
                                    이미 계정이 있으신가요?{' '}
                                    <span className="underline">로그인</span>
                                </>
                            ) : (
                                <>
                                    계정이 없으신가요?{' '}
                                    <span className="underline">회원가입</span>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </Card>
        </div>
    )
}
