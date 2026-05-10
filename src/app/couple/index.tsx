'use client'

import { CoupleMatchPageProps } from './types'
import { useCoupleMatch } from './hooks/useCoupleMatch'
import { SelectStep } from './components/selectStep'
import { CreateStep } from './components/createStep'
import { JoinStep } from './components/joinStep'
import { NicknameStep } from './components/nicknameStep'

export const CoupleMatchPage = ({
    onMatchSuccess,
    initialMode = 'select',
}: CoupleMatchPageProps) => {
    const {
        mode,
        setMode,
        inputCode,
        setInputCode,
        generatedCode,
        loading,
        error,
        partnerNickname,
        setPartnerNickname,
        handleCreateCode,
        handleJoinCouple,
        handleSaveNickname,
        handleShare,
    } = useCoupleMatch(onMatchSuccess, initialMode)

    const fullScreenWrapper = (children: React.ReactNode) => (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            {children}
        </div>
    )

    if (mode === 'select')
        return fullScreenWrapper(
            <SelectStep onSelect={setMode} />,
        )

    if (mode === 'create')
        return fullScreenWrapper(
            <CreateStep
                generatedCode={generatedCode}
                loading={loading}
                error={error}
                onBack={() => setMode('select')}
                onCreateCode={handleCreateCode}
                onShare={handleShare}
            />,
        )

    if (mode === 'nickname')
        return fullScreenWrapper(
            <NicknameStep
                partnerNickname={partnerNickname}
                loading={loading}
                error={error}
                onChange={setPartnerNickname}
                onSubmit={handleSaveNickname}
            />,
        )

    return fullScreenWrapper(
        <JoinStep
            inputCode={inputCode}
            loading={loading}
            error={error}
            onBack={() => setMode('select')}
            onCodeChange={setInputCode}
            onJoin={handleJoinCouple}
        />,
    )
}
