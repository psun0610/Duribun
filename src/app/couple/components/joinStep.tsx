import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface JoinStepProps {
    inputCode: string
    loading: boolean
    error: string
    onBack: () => void
    onCodeChange: (value: string) => void
    onJoin: () => void
}

export const JoinStep = ({
    inputCode,
    loading,
    error,
    onBack,
    onCodeChange,
    onJoin,
}: JoinStepProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
    >
        <Card>
            <button
                onClick={onBack}
                className="text-sm text-muted-foreground hover:text-foreground mb-4"
            >
                ←돌아가기
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center">코드 입력</h3>
            <div className="space-y-4">
                <Input
                    type="text"
                    value={inputCode}
                    onChange={(e) =>
                        onCodeChange(
                            e.target.value.replace(/\D/g, '').slice(0, 6),
                        )
                    }
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-2xl tracking-wider"
                />
                <Button
                    onClick={onJoin}
                    disabled={loading || inputCode.length !== 6}
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
)
