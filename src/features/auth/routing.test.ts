import { describe, expect, it } from 'vitest'
import { getAuthGateRedirect, isProtectedPath } from './routing'

describe('auth gate routing', () => {
    it('marks app routes as protected', () => {
        expect(isProtectedPath('/app')).toBe(true)
        expect(isProtectedPath('/app/places')).toBe(true)
        expect(isProtectedPath('/login')).toBe(false)
    })

    it('redirects anonymous users away from protected routes', () => {
        expect(
            getAuthGateRedirect({
                pathname: '/app',
                isAuthenticated: false,
            })
        ).toBe('/login?next=%2Fapp')
    })

    it('allows authenticated users into protected routes', () => {
        expect(
            getAuthGateRedirect({
                pathname: '/app',
                isAuthenticated: true,
            })
        ).toBeNull()
    })

    it('redirects authenticated users away from login', () => {
        expect(
            getAuthGateRedirect({
                pathname: '/login',
                isAuthenticated: true,
            })
        ).toBe('/app')
    })
})
