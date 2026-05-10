'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'motion/react'
import {
    Heart,
    MapPin,
    Plus,
    LogOut,
    LayoutGrid,
    LayoutList,
    SquareStack,
} from 'lucide-react'
import { cn } from '@/components/ui/utils'
import { usePlaces } from './hooks/usePlaces'
import { usePlaceListView } from './hooks/usePlaceListView'
import { PlaceCard } from './components/placeCard'
import { PlaceGridTile } from './components/placeGridTile'
import { PlaceModal } from './components/placeModal'
import { ReviewModal } from './components/reviewModal'
import { Place, PlaceListViewMode } from './types'

const viewLabels: Record<PlaceListViewMode, string> = {
    grid: '그리드',
    cards: '카드',
    compact: '간단 카드',
}

export const Dashboard = () => {
    const { places, loading } = usePlaces()
    const { mode: listViewMode, setMode: setListViewMode } = usePlaceListView()
    const [showPlaceModal, setShowPlaceModal] = useState(false)
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

    useEffect(() => {
        if (!selectedPlace) return
        const fresh = places.find((p) => p.id === selectedPlace.id)
        if (fresh) setSelectedPlace(fresh)
    }, [places])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <Heart className="h-12 w-12 fill-primary text-primary" />
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 bg-card shadow-sm">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                        <Heart className="h-8 w-8 fill-primary text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">
                            두리번
                        </h1>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="px-4 py-2"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <main
                className={cn(
                    'mx-auto px-4 py-8',
                    listViewMode === 'grid'
                        ? 'max-w-6xl'
                        : listViewMode === 'compact'
                          ? 'max-w-5xl'
                          : 'max-w-4xl',
                )}
            >
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            우리의 장소
                        </h2>
                        <p className="text-muted-foreground">
                            함께 만들어가는 추억
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <div
                            className="flex rounded-xl border border-border bg-muted/40 p-0.5"
                            role="group"
                            aria-label="목록 표시 형식"
                        >
                            <Button
                                type="button"
                                variant={
                                    listViewMode === 'grid'
                                        ? 'secondary'
                                        : 'ghost'
                                }
                                size="sm"
                                className="h-9 w-9 shrink-0 rounded-lg px-0"
                                aria-label={viewLabels.grid}
                                title={viewLabels.grid}
                                aria-pressed={listViewMode === 'grid'}
                                onClick={() => setListViewMode('grid')}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    listViewMode === 'cards'
                                        ? 'secondary'
                                        : 'ghost'
                                }
                                size="sm"
                                className="h-9 w-9 shrink-0 rounded-lg px-0"
                                aria-label={viewLabels.cards}
                                title={viewLabels.cards}
                                aria-pressed={listViewMode === 'cards'}
                                onClick={() => setListViewMode('cards')}
                            >
                                <SquareStack className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    listViewMode === 'compact'
                                        ? 'secondary'
                                        : 'ghost'
                                }
                                size="sm"
                                className="h-9 w-9 shrink-0 rounded-lg px-0"
                                aria-label={viewLabels.compact}
                                title={viewLabels.compact}
                                aria-pressed={listViewMode === 'compact'}
                                onClick={() => setListViewMode('compact')}
                            >
                                <LayoutList className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            variant="default"
                            onClick={() => setShowPlaceModal(true)}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            장소 추가
                        </Button>
                    </div>
                </div>

                {places.length === 0 ? (
                    <Card className="py-12 text-center">
                        <MapPin className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-xl font-medium text-foreground">
                            아직 장소가 없어요
                        </h3>
                        <p className="mb-6 text-muted-foreground">
                            첫 번째 데이트 장소를 추가해보세요!
                        </p>
                        <Button
                            variant="default"
                            onClick={() => setShowPlaceModal(true)}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            장소 추가하기
                        </Button>
                    </Card>
                ) : listViewMode === 'grid' ? (
                    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-3 md:gap-2 lg:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {places.map((place) => (
                                <PlaceGridTile
                                    key={place.id}
                                    place={place}
                                    onOpen={setSelectedPlace}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'grid',
                            listViewMode === 'compact'
                                ? 'grid-cols-2 gap-3 lg:grid-cols-3'
                                : 'gap-4 md:grid-cols-2',
                        )}
                    >
                        <AnimatePresence>
                            {places.map((place) => (
                                <PlaceCard
                                    key={place.id}
                                    place={place}
                                    onOpen={setSelectedPlace}
                                    density={
                                        listViewMode === 'compact'
                                            ? 'compact'
                                            : 'default'
                                    }
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
