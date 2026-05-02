'use client'

import { useState } from 'react'
import { apiCall } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { motion } from 'motion/react'
import { Heart, Copy, Check } from 'lucide-react'
import confetti from 'canvas-confetti'

interface CoupleMatchPageProps {
    onMatchSuccess: () => void
}

export const CoupleMatchPage = ({ onMatchSuccess }: CoupleMatchPageProps) => {
    const [mode, setMode] = useState<'select' | 'create' | 'join'>('select')
    const [code, setCode] = useState('')
    const [generatedCode, setGeneratedCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    const handleCreateCode = async () => {
        setLoading(true)
        setError('')
        try {
            const response = (await apiCall('/couple/create-code', {
                method: 'POST',
            })) as { code: string }
            setGeneratedCode(response.code)
        } catch (err: unknown) {
            setError((err as Error).message || '코드 생성에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    const handleJoinCouple = async () => {
        setLoading(true)
        setError('')
        try {
            await apiCall('/couple/join', {
                method: 'POST',
                body: JSON.stringify({ code }),
            })

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF9B9B', '#FFD4C4', '#FFCBA4'],
            })

            setTimeout(() => onMatchSuccess(), 1500)
        } catch (err: unknown) {
            setError((err as Error).message || '커플 연결에 실패했습니다')
            setLoading(false)
        }
    }

    const copyCode = () => {
        navigator.clipboard.writeText(generatedCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (mode === 'select') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-flex gap-2 mb-4"
                        >
                            <Heart className="w-12 h-12 text-primary/50 fill-primary/50" />
                            <Heart className="w-12 h-12 text-primary/50 fill-primary/50" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            커플 매칭
                        </h2>
                        <p className="text-muted-foreground">
                            두 사람의 추억을 함께 기록해요
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Card
                            className="cursor-pointer hover:shadow-xl transition-shadow"
                            onClick={() => setMode('create')}
                        >
                            <h3 className="text-xl font-medium mb-2">
                                코드 생성하기
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                6자리 코드를 만들어 상대방에게 공유하세요
                            </p>
                        </Card>
                        <Card
                            className="cursor-pointer hover:shadow-xl transition-shadow"
                            onClick={() => setMode('join')}
                        >
                            <h3 className="text-xl font-medium mb-2">
                                코드 입력하기
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                상대방이 공유한 코드를 입력하세요
                            </p>
                        </Card>
                    </div>
                </motion.div>
            </div>
        )
    }

    if (mode === 'create') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card>
                        <button
                            onClick={() => setMode('select')}
                            className="text-sm text-muted-foreground hover:text-foreground mb-4"
                        >
                            ← 돌아가기
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-center">
                            코드 생성
                        </h3>

                        {!generatedCode ? (
                            <Button
                                onClick={handleCreateCode}
                                disabled={loading}
                                variant="default"
                                className="w-full"
                            >
                                {loading ? '생성 중...' : '6자리 코드 생성'}
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-secondary/30 rounded-2xl p-6 text-center">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        매칭 코드
                                    </p>
                                    <p className="text-4xl font-bold tracking-wider text-primary">
                                        {generatedCode}
                                    </p>
                                </div>
                                <Button
                                    onClick={copyCode}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            복사됨!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            코드 복사
                                        </>
                                    )}
                                </Button>
                                <p className="text-sm text-center text-muted-foreground">
                                    이 코드를 상대방에게 공유하세요.
                                    <br />
                                    24시간 후 만료됩니다.
                                </p>
                            </div>
                        )}

                        {error && (
                            <p className="text-destructive text-sm text-center mt-4">
                                {error}
                            </p>
                        )}
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <Card>
                    <button
                        onClick={() => setMode('select')}
                        className="text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        ← 돌아가기
                    </button>
                    <h3 className="text-2xl font-bold mb-6 text-center">
                        코드 입력
                    </h3>
                    <div className="space-y-4">
                        <Input
                            // label="6자리 매칭 코드"
                            type="text"
                            value={code}
                            onChange={(e) =>
                                setCode(
                                    e.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 6),
                                )
                            }
                            placeholder="000000"
                            maxLength={6}
                            className="text-center text-2xl tracking-wider"
                        />
                        <Button
                            onClick={handleJoinCouple}
                            disabled={loading || code.length !== 6}
                            variant="default"
                            className="w-full"
                        >
                            {loading ? '연결 중...' : '커플 연결'}
                        </Button>
                        {error && (
                            <p className="text-destructive text-sm text-center">
                                {error}
                            </p>
                        )}
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}
