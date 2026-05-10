import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CoupleMode } from '../types'

interface SelectStepProps {
    onSelect: (mode: CoupleMode) => void
}

export const SelectStep = ({ onSelect }: SelectStepProps) => (
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
            <p className="text-muted-foreground">두 사람의 추억을 함께 기록해요</p>
        </div>

        <div className="space-y-4">
            <Card
                className="cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => onSelect('create')}
            >
                <h3 className="text-xl font-medium mb-2">코드 생성하기</h3>
                <p className="text-sm text-muted-foreground">
                    6자리 코드를 만들어 상대방에게 공유하세요
                </p>
            </Card>
            <Card
                className="cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => onSelect('join')}
            >
                <h3 className="text-xl font-medium mb-2">코드 입력하기</h3>
                <p className="text-sm text-muted-foreground">
                    상대방이 공유한 코드를 입력하세요
                </p>
            </Card>
        </div>
    </motion.div>
)
