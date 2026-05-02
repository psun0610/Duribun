import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient, type User } from 'npm:@supabase/supabase-js'

const app = new Hono()

function serviceSupabase() {
    const url = Deno.env.get('SUPABASE_URL') || ''
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    return createClient(url, key)
}

app.use('*', logger(console.log))

app.use(
    '/*',
    cors({
        origin: '*',
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
    }),
)

async function verifyAuth(authHeader: string | null): Promise<User | null> {
    if (!authHeader) return null
    const accessToken = authHeader.split(' ')[1]
    const supabase = serviceSupabase()
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(accessToken)
    if (error || !user) return null
    return user
}

function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

type ReviewRow = {
    id: string
    place_id: string
    user_id: string
    ratings: unknown
    weather: string
    mood: string
    revisit: boolean
    comment: string | null
    rating: number
    created_at: string
}

function mapReviewRow(r: ReviewRow) {
    return {
        id: r.id,
        placeId: r.place_id,
        userId: r.user_id,
        ratings: r.ratings,
        weather: r.weather,
        mood: r.mood,
        revisit: r.revisit,
        comment: r.comment,
        rating: r.rating,
        createdAt: r.created_at,
    }
}

function mapCoupleRow(c: {
    id: string
    user_a_id: string
    user_b_id: string
    created_at: string
}) {
    return {
        id: c.id,
        user1Id: c.user_a_id,
        user2Id: c.user_b_id,
        createdAt: c.created_at,
    }
}

app.get('/duribun-api/health', (c) => {
    return c.json({ status: 'ok' })
})

app.post('/duribun-api/auth/signup', async (c) => {
    try {
        const { email, password, name } = await c.req.json()
        const supabase = serviceSupabase()

        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: { name },
            email_confirm: true,
        })

        if (error) {
            console.log('Sign up error:', error)
            return c.json({ error: error.message }, 400)
        }

        // 프로필은 auth.users 트리거(handle_new_user)로 생성됩니다.
        return c.json({ user: data.user })
    } catch (error) {
        console.log('Sign up error:', error)
        return c.json({ error: 'Failed to sign up' }, 500)
    }
})

app.post('/duribun-api/couple/create-code', async (c) => {
    try {
        const user = await verifyAuth(c.req.header('Authorization'))
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const supabase = serviceSupabase()
        const code = generateCode()
        const expiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000,
        ).toISOString()

        await supabase
            .from('couple_invite_codes')
            .delete()
            .eq('inviter_id', user.id)

        const { error } = await supabase.from('couple_invite_codes').insert({
            code,
            inviter_id: user.id,
            expires_at: expiresAt,
        })

        if (error) {
            console.log('Create code insert error:', error)
            return c.json({ error: 'Failed to create code' }, 500)
        }

        return c.json({ code })
    } catch (error) {
        console.log('Create code error:', error)
        return c.json({ error: 'Failed to create code' }, 500)
    }
})

app.post('/duribun-api/couple/join', async (c) => {
    try {
        const user = await verifyAuth(c.req.header('Authorization'))
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const { code } = await c.req.json()
        if (!code || String(code).length !== 6) {
            return c.json({ error: 'Invalid or expired code' }, 400)
        }

        const supabase = serviceSupabase()
        const { data: coupleId, error } = await supabase.rpc(
            'join_couple_with_code',
            {
                p_code: String(code),
                p_joiner: user.id,
            },
        )

        if (error) {
            console.log('Join RPC error:', error)
            const msg = error.message || ''
            if (msg.includes('Cannot match with yourself')) {
                return c.json({ error: 'Cannot match with yourself' }, 400)
            }
            if (msg.includes('already matched')) {
                return c.json({ error: 'Already in a couple' }, 400)
            }
            return c.json({ error: 'Invalid or expired code' }, 400)
        }

        const { data: coupleRow, error: fetchErr } = await supabase
            .from('couples')
            .select('id, user_a_id, user_b_id, created_at')
            .eq('id', coupleId)
            .single()

        if (fetchErr || !coupleRow) {
            return c.json({ error: 'Failed to load couple' }, 500)
        }

        return c.json({ couple: mapCoupleRow(coupleRow) })
    } catch (error) {
        console.log('Join couple error:', error)
        return c.json({ error: 'Failed to join couple' }, 500)
    }
})

app.get('/duribun-api/couple/status', async (c) => {
    try {
        const user = await verifyAuth(c.req.header('Authorization'))
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const supabase = serviceSupabase()
        const { data: profile, error: pErr } = await supabase
            .from('profiles')
            .select('couple_id')
            .eq('id', user.id)
            .maybeSingle()

        if (pErr) {
            console.log('Profile fetch error:', pErr)
            return c.json({ error: 'Failed to get couple status' }, 500)
        }

        if (!profile?.couple_id) {
            return c.json({ matched: false })
        }

        const { data: coupleRow, error: cErr } = await supabase
            .from('couples')
            .select('id, user_a_id, user_b_id, created_at')
            .eq('id', profile.couple_id)
            .maybeSingle()

        if (cErr || !coupleRow) {
            return c.json({ matched: false })
        }

        return c.json({ matched: true, couple: mapCoupleRow(coupleRow) })
    } catch (error) {
        console.log('Get couple status error:', error)
        return c.json({ error: 'Failed to get couple status' }, 500)
    }
})

app.post('/duribun-api/places', async (c) => {
    try {
        const user = await verifyAuth(c.req.header('Authorization'))
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const body = await c.req.json()
        const { name, address, category, lat, lng } = body
        const supabase = serviceSupabase()

        const { data: profile, error: pErr } = await supabase
            .from('profiles')
            .select('couple_id')
            .eq('id', user.id)
            .maybeSingle()

        if (pErr || !profile?.couple_id) {
            return c.json({ error: 'Not in a couple' }, 400)
        }

        const { data: place, error: insErr } = await supabase
            .from('places')
            .insert({
                couple_id: profile.couple_id,
                name,
                address,
                category,
                lat: lat ?? null,
                lng: lng ?? null,
            })
            .select('id')
            .single()

        if (insErr || !place) {
            console.log('Place insert error:', insErr)
            return c.json({ error: 'Failed to create place' }, 500)
        }

        return c.json({ placeId: place.id })
    } catch (error) {
        console.log('Create place error:', error)
        return c.json({ error: 'Failed to create place' }, 500)
    }
})

app.post('/duribun-api/reviews', async (c) => {
    try {
        const user = await verifyAuth(c.req.header('Authorization'))
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const reviewData = await c.req.json()
        const { placeId, ratings, weather, mood, revisit, comment, rating } =
            reviewData
        if (!placeId) {
            return c.json({ error: 'placeId required' }, 400)
        }

        const supabase = serviceSupabase()

        const { data: profile, error: pErr } = await supabase
            .from('profiles')
            .select('couple_id')
            .eq('id', user.id)
            .maybeSingle()

        if (pErr || !profile?.couple_id) {
            return c.json({ error: 'Not in a couple' }, 400)
        }

        const { data: place, error: plErr } = await supabase
            .from('places')
            .select('id, couple_id')
            .eq('id', placeId)
            .maybeSingle()

        if (plErr || !place || place.couple_id !== profile.couple_id) {
            return c.json({ error: 'Place not found' }, 404)
        }

        const { data: row, error: upErr } = await supabase
            .from('reviews')
            .upsert(
                {
                    place_id: placeId,
                    user_id: user.id,
                    ratings: ratings ?? {},
                    weather: weather ?? '맑음',
                    mood: mood ?? '좋음',
                    revisit: revisit ?? true,
                    comment: comment ?? null,
                    rating,
                },
                { onConflict: 'place_id,user_id' },
            )
            .select('id')
            .single()

        if (upErr || !row) {
            console.log('Review upsert error:', upErr)
            return c.json({ error: 'Failed to create review' }, 500)
        }

        return c.json({ reviewId: row.id })
    } catch (error) {
        console.log('Create review error:', error)
        return c.json({ error: 'Failed to create review' }, 500)
    }
})

app.get('/duribun-api/reviews/:placeId', async (c) => {
    try {
        const user = await verifyAuth(c.req.header('Authorization'))
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const placeId = c.req.param('placeId')
        const supabase = serviceSupabase()

        const { data: profile, error: pErr } = await supabase
            .from('profiles')
            .select('couple_id')
            .eq('id', user.id)
            .maybeSingle()

        if (pErr || !profile?.couple_id) {
            return c.json({ error: 'Not in a couple' }, 400)
        }

        const { data: place, error: plErr } = await supabase
            .from('places')
            .select('id, couple_id')
            .eq('id', placeId)
            .maybeSingle()

        if (plErr || !place || place.couple_id !== profile.couple_id) {
            return c.json({ error: 'Place not found' }, 404)
        }

        const { data: reviewRows, error: rErr } = await supabase
            .from('reviews')
            .select(
                'id, place_id, user_id, ratings, weather, mood, revisit, comment, rating, created_at',
            )
            .eq('place_id', placeId)

        if (rErr) {
            console.log('Reviews fetch error:', rErr)
            return c.json({ error: 'Failed to get reviews' }, 500)
        }

        const mapped = (reviewRows ?? []).map((r) =>
            mapReviewRow(r as ReviewRow),
        )
        const myReview = mapped.find((r) => r.userId === user.id)
        const partnerReview = mapped.find((r) => r.userId !== user.id)

        return c.json({
            myReview,
            partnerReview,
            bothCompleted: !!(myReview && partnerReview),
        })
    } catch (error) {
        console.log('Get reviews error:', error)
        return c.json({ error: 'Failed to get reviews' }, 500)
    }
})

app.get('/duribun-api/places/list', async (c) => {
    try {
        const user = await verifyAuth(c.req.header('Authorization'))
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const supabase = serviceSupabase()

        const { data: profile, error: pErr } = await supabase
            .from('profiles')
            .select('couple_id')
            .eq('id', user.id)
            .maybeSingle()

        if (pErr || !profile?.couple_id) {
            return c.json({ error: 'Not in a couple' }, 400)
        }

        const { data: placeRows, error: plErr } = await supabase
            .from('places')
            .select(
                'id, couple_id, name, address, category, lat, lng, created_at',
            )
            .eq('couple_id', profile.couple_id)
            .order('created_at', { ascending: false })

        if (plErr) {
            console.log('Places list error:', plErr)
            return c.json({ error: 'Failed to get places' }, 500)
        }

        const places = placeRows ?? []
        const placeIds = places.map((p) => p.id)
        let reviewRows: ReviewRow[] = []

        if (placeIds.length > 0) {
            const { data: rData, error: rErr } = await supabase
                .from('reviews')
                .select(
                    'id, place_id, user_id, ratings, weather, mood, revisit, comment, rating, created_at',
                )
                .in('place_id', placeIds)

            if (rErr) {
                console.log('Reviews batch error:', rErr)
                return c.json({ error: 'Failed to get places' }, 500)
            }
            reviewRows = (rData ?? []) as ReviewRow[]
        }

        const byPlace = new Map<string, ReturnType<typeof mapReviewRow>[]>()
        for (const r of reviewRows) {
            const list = byPlace.get(r.place_id) ?? []
            list.push(mapReviewRow(r))
            byPlace.set(r.place_id, list)
        }

        const placesWithReviews = places.map((p) => {
            const reviews = byPlace.get(p.id) ?? []
            const myReview = reviews.find((r) => r.userId === user.id)
            const partnerReview = reviews.find((r) => r.userId !== user.id)

            return {
                id: p.id,
                coupleId: p.couple_id,
                name: p.name,
                address: p.address,
                category: p.category,
                lat: p.lat ?? undefined,
                lng: p.lng ?? undefined,
                createdAt: p.created_at,
                myReview,
                partnerReview,
                bothCompleted: !!(myReview && partnerReview),
            }
        })

        return c.json({ places: placesWithReviews })
    } catch (error) {
        console.log('Get places list error:', error)
        return c.json({ error: 'Failed to get places' }, 500)
    }
})

Deno.serve(app.fetch)
