'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, MapPin, Plus, LogOut } from 'lucide-react'
import { usePlaces } from './hooks/usePlaces'
import { PlaceCard } from './components/placeCard'
import { PlaceModal } from './components/placeModal'
import { ReviewModal } from './components/reviewModal'
import { Place } from './types'

export const Dashboard = () => {
    const { places, loading } = usePlaces()
    const [showPlaceModal, setShowPlaceModal] = useState(false)
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <Heart className="w-12 h-12 text-primary fill-primary" />
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Heart className="w-8 h-8 text-primary fill-primary" />
                        <h1 className="text-2xl font-bold text-foreground">
                            두리번
                        </h1>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="px-4 py-2"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            우리의 장소
                        </h2>
                        <p className="text-muted-foreground">
                            함께 만들어가는 추억
                        </p>
                    </div>
                    <Button
                        variant="default"
                        onClick={() => setShowPlaceModal(true)}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        장소 추가
                    </Button>
                </div>

                {places.length === 0 ? (
                    <Card className="text-center py-12">
                        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-foreground mb-2">
                            아직 장소가 없어요
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            첫 번째 데이트 장소를 추가해보세요!
                        </p>
                        <Button
                            variant="default"
                            onClick={() => setShowPlaceModal(true)}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            장소 추가하기
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        <AnimatePresence>
                            {places.map((place) => (
                                <PlaceCard
                                    key={place.id}
                                    place={place}
                                    onOpen={setSelectedPlace}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {showPlaceModal && (
                <PlaceModal
                    onClose={() => setShowPlaceModal(false)}
                    onPlaceAdded={() => setShowPlaceModal(false)}
                />
            )}

            {selectedPlace && (
                <ReviewModal
                    place={selectedPlace}
                    onClose={() => setSelectedPlace(null)}
                    onReviewAdded={() => setSelectedPlace(null)}
                />
            )}
        </div>
    )
}
