import type {
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react'

export interface FieldBaseProps {
    className?: string
    helpText?: string
    label: ReactNode
}

export interface TextFieldProps
    extends FieldBaseProps,
        InputHTMLAttributes<HTMLInputElement> {
    inputClassName?: string
}

export interface TextareaFieldProps
    extends FieldBaseProps,
        TextareaHTMLAttributes<HTMLTextAreaElement> {
    textareaClassName?: string
}

export interface SelectFieldProps
    extends FieldBaseProps,
        SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode
    selectClassName?: string
}
