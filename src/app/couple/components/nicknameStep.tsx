import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface NicknameStepProps {
    partnerNickname: string
    loading: boolean
    error: string
    onChange: (value: string) => void
    onSubmit: () => void
}

export const NicknameStep = ({
    partnerNickname,
    loading,
    error,
    onChange,
    onSubmit,
}: NicknameStepProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-md"
    >
        <Card>
            <div className="text-center mb-8">
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="inline-flex mb-4"
                >
                    <Heart className="w-14 h-14 text-primary fill-primary" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">반가워요!</h3>
                <p className="text-muted-foreground">
                    당신의 연인을 뭐라고 부를까요? 🥰
                </p>
            </div>

            <div className="space-y-4">
                <Input
                    type="text"
                    value={partnerNickname}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSubmit()
                    }}
                    placeholder="자기야, 여보, 토끼..."
                    maxLength={20}
                    className="text-center text-lg h-14 rounded-2xl"
                    autoFocus
                />
                <motion.button
                    onClick={onSubmit}
                    disabled={loading || !partnerNickname.trim()}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 rounded-full py-3 px-6 bg-primary text-primary-foreground font-medium text-sm shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '저장 중...' : '시작하기 💕'}
                </motion.button>
                {error && (
                    <p className="text-destructive text-sm text-center">
                        {error}
                    </p>
                )}
            </div>
        </Card>
    </motion.div>
)
