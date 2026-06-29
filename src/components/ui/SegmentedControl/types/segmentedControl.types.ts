import type { ReactNode } from 'react'

export interface SegmentedControlOption {
    icon?: ReactNode
    label: string
    value: string
}

export interface SegmentedControlProps {
    ariaLabel: string
    className?: string
    onChange: (value: string) => void
    options: SegmentedControlOption[]
    value: string
}
