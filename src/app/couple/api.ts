import { apiCall } from '@/lib/supabase/client'

export const createCode = async (): Promise<string> => {
    const response = (await apiCall('/couple/create-code', {
        method: 'POST',
    })) as { code: string }
    return response.code
}

export const joinCouple = async (code: string): Promise<void> => {
    await apiCall('/couple/join', {
        method: 'POST',
        body: JSON.stringify({ code }),
    })
}

export const saveNickname = async (partnerNickname: string): Promise<void> => {
    await apiCall('/profile/partner-nickname', {
        method: 'PATCH',
        body: JSON.stringify({ partner_nickname: partnerNickname }),
    })
}
