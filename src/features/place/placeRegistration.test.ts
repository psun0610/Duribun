import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

const initialSchemaSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260525000000_initial_schema.sql'
    ),
    'utf8'
)
const placeRegistrationSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260615000000_add_place_registration_rpcs.sql'
    ),
    'utf8'
)
const placeActionsSource = readFileSync(
    path.resolve(process.cwd(), 'src/features/place/actions.ts'),
    'utf8'
)
const appPageSource = readFileSync(
    path.resolve(process.cwd(), 'src/app/app/page.tsx'),
    'utf8'
)
const couplePlaceAppSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/place/components/CouplePlaceApp/CouplePlaceApp.tsx'
    ),
    'utf8'
)
const registeredPlaceCardsSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/place/components/CouplePlaceApp/components/RegisteredPlaceCards.tsx'
    ),
    'utf8'
)
const placesTabPanelSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/place/components/CouplePlaceApp/components/PlacesTabPanel.tsx'
    ),
    'utf8'
)

describe('place registration', () => {
    it('searches Kakao Local through a server-controlled integration', () => {
        expect(placeActionsSource).toContain('searchKakaoPlaces')
        expect(placeActionsSource).toContain('KAKAO_REST_API_KEY')
        expect(placeActionsSource).toContain(
            '/v2/local/search/keyword.json'
        )
        expect(placeActionsSource).toContain('Authorization')
    })

    it('creates or reuses Kakao global places by provider place id', () => {
        expect(placeRegistrationSql).toContain(
            'create or replace function public.register_kakao_couple_place'
        )
        expect(initialSchemaSql).toContain(
            'create unique index places_provider_place_id_unique'
        )
        expect(placeRegistrationSql).toContain(
            'on conflict (provider, provider_place_id) where provider_place_id is not null'
        )
        expect(placeRegistrationSql).toContain("'kakao'")
    })

    it('adds selected Kakao places to the active couple place list', () => {
        expect(placeRegistrationSql).toContain(
            'my_couple_id := public.current_couple_id()'
        )
        expect(placeRegistrationSql).toContain(
            'insert into public.couple_places (couple_id, place_id, created_by)'
        )
        expect(placeRegistrationSql).toContain(
            'on conflict (couple_id, place_id) do update'
        )
        expect(appPageSource).toContain('getCouplePlaces(couple.id)')
        expect(registeredPlaceCardsSource).toContain('RegisteredPlaceFeedCard')
        expect(registeredPlaceCardsSource).toContain('RegisteredPlaceListCard')
        expect(registeredPlaceCardsSource).toContain('getReviewTargetPlace')
        expect(couplePlaceAppSource).toContain('PlacesTabPanel')
    })

    it('supports manual places without immediate explore approval', () => {
        expect(placeRegistrationSql).toContain(
            'create or replace function public.register_manual_couple_place'
        )
        expect(placeRegistrationSql).toContain("'manual'")
        expect(placeRegistrationSql).toContain('false')
        expect(placeActionsSource).toContain('registerManualPlace')
        expect(placesTabPanelSource).toContain('viewMode ===')
    })

    it('grants authenticated users registration RPC access', () => {
        expect(placeRegistrationSql).toContain(
            'grant execute on function public.register_kakao_couple_place'
        )
        expect(placeRegistrationSql).toContain('to authenticated')
        expect(placeRegistrationSql).toContain(
            'grant execute on function public.register_manual_couple_place'
        )
    })
})
