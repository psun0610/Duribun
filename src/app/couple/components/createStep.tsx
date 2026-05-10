import { motion } from 'motion/react'
import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CreateStepProps {
    generatedCode: string
    loading: boolean
    error: string
    onBack: () => void
    onCreateCode: () => void
    onShare: () => void
}

export const CreateStep = ({
    generatedCode,
    loading,
    error,
    onBack,
    onCreateCode,
    onShare,
}: CreateStepProps) => (
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
            <h3 className="text-2xl font-bold mb-6 text-center">코드 생성</h3>

            {!generatedCode ? (
                <Button
                    onClick={onCreateCode}
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
                    <motion.button
                        onClick={onShare}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2 rounded-full py-3 px-6 bg-primary text-primary-foreground font-medium text-sm shadow-sm transition-colors hover:bg-primary/90"
                    >
                        <Share2 className="w-4 h-4" />
                        공유하기
                    </motion.button>
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
)
