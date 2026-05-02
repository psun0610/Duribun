'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiCall, supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PlaceModal } from './placeModal'
import { ReviewModal } from './reviewModal'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, MapPin, Plus, LogOut, Star, Eye, EyeOff } from 'lucide-react'

interface Place {
    id: string
    name: string
    address: string
    category: string
    lat?: number
    lng?: number
    myReview?: Record<string, unknown>
    partnerReview?: Record<string, unknown>
    bothCompleted: boolean
}

export const Dashboard = () => {
    const [places, setPlaces] = useState<Place[]>([])
    const [loading, setLoading] = useState(true)
    const [showPlaceModal, setShowPlaceModal] = useState(false)
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
    const [showReviewModal, setShowReviewModal] = useState(false)

    const loadPlaces = useCallback(async () => {
        try {
            const response = (await apiCall('/places/list')) as {
                places?: Place[]
            }
            setPlaces(response.places || [])
        } catch (err) {
            console.error('Failed to load places:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadPlaces()
    }, [loadPlaces])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    const handlePlaceAdded = () => {
        setShowPlaceModal(false)
        void loadPlaces()
    }

    const handleReviewAdded = () => {
        setShowReviewModal(false)
        setSelectedPlace(null)
        void loadPlaces()
    }

    const openReviewModal = (place: Place) => {
        setSelectedPlace(place)
        setShowReviewModal(true)
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
                                <motion.div
                                    key={place.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Card
                                        className="hover:shadow-xl transition-shadow cursor-pointer"
                                        onClick={() =>
                                            !place.myReview &&
                                            openReviewModal(place)
                                        }
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-foreground">
                                                        {place.name}
                                                    </h3>
                                                    {place.bothCompleted ? (
                                                        <Heart className="w-5 h-5 text-primary fill-primary" />
                                                    ) : (
                                                        <div className="flex">
                                                            <Heart
                                                                className={`w-5 h-5 ${place.myReview ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                                                            />
                                                            <Heart
                                                                className={`w-5 h-5 -ml-2 ${place.partnerReview ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {place.address}
                                                </p>
                                                <span className="inline-block px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                                                    {place.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-border">
                                            {place.myReview &&
                                            place.partnerReview ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            내 평점
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-primary fill-primary" />
                                                            <span className="text-sm font-medium">
                                                                {String(
                                                                    place
                                                                        .myReview
                                                                        .rating,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            상대 평점
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-primary fill-primary" />
                                                            <span className="text-sm font-medium">
                                                                {String(
                                                                    place
                                                                        .partnerReview
                                                                        .rating,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            openReviewModal(
                                                                place,
                                                            )
                                                        }}
                                                        className="w-full mt-2 text-sm text-primary hover:underline"
                                                    >
                                                        자세히 보기
                                                    </button>
                                                </div>
                                            ) : place.myReview ? (
                                                <div className="text-center py-2">
                                                    <EyeOff className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                                                    <p className="text-sm text-muted-foreground">
                                                        상대방이 리뷰 작성 중...
                                                    </p>
                                                </div>
                                            ) : place.partnerReview ? (
                                                <div className="text-center py-2">
                                                    <Eye className="w-5 h-5 text-primary mx-auto mb-1" />
                                                    <p className="text-sm text-primary font-medium">
                                                        리뷰를 작성해주세요!
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-center py-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        아직 리뷰가 없어요
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {showPlaceModal && (
                <PlaceModal
                    onClose={() => setShowPlaceModal(false)}
                    onPlaceAdded={handlePlaceAdded}
                />
            )}

            {showReviewModal && selectedPlace && (
                <ReviewModal
                    place={selectedPlace}
                    onClose={() => {
                        setShowReviewModal(false)
                        setSelectedPlace(null)
                    }}
                    onReviewAdded={handleReviewAdded}
                />
            )}
        </div>
    )
}
