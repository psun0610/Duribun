'use client'

import { useState } from 'react'
import { apiCall } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'motion/react'
import { X } from 'lucide-react'

interface PlaceModalProps {
    onClose: () => void
    onPlaceAdded: () => void
}

export const PlaceModal = ({ onClose, onPlaceAdded }: PlaceModalProps) => {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [category, setCategory] = useState<'식당' | '카페' | '액티비티'>(
        '식당',
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await apiCall('/places', {
                method: 'POST',
                body: JSON.stringify({ name, address, category }),
            })
            onPlaceAdded()
        } catch (err: unknown) {
            setError((err as Error).message || '장소 추가에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card rounded-3xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                        장소 추가
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm text-foreground/80">
                            카테고리
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['식당', '카페', '액티비티'] as const).map(
                                (cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`py-3 rounded-2xl font-medium transition-all ${
                                            category === cat
                                                ? 'bg-primary text-primary-foreground shadow-md'
                                                : 'bg-secondary text-secondary-foreground'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    <Input
                        // label="장소 이름"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="예: 맛있는 파스타집"
                    />
                    <Input
                        // label="주소"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="예: 서울시 강남구..."
                    />

                    {error && (
                        <p className="text-destructive text-sm">{error}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? '추가 중...' : '추가하기'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
