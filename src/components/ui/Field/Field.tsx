import type {
    SelectFieldProps,
    TextareaFieldProps,
    TextFieldProps,
} from './types/field.types'

import styles from './Field.module.scss'

const getClassName = (...classNames: Array<string | undefined>) =>
    classNames.filter(Boolean).join(' ')

export const TextField = ({
    className,
    helpText,
    inputClassName,
    label,
    ...inputProps
}: TextFieldProps) => {
    return (
        <label className={getClassName(styles.field, className)}>
            <span>{label}</span>
            <input
                className={getClassName(styles.control, inputClassName)}
                {...inputProps}
            />
            {helpText ? <p className={styles.helpText}>{helpText}</p> : null}
        </label>
    )
}

export const TextareaField = ({
    className,
    helpText,
    label,
    textareaClassName,
    ...textareaProps
}: TextareaFieldProps) => {
    return (
        <label className={getClassName(styles.field, className)}>
            <span>{label}</span>
            <textarea
                className={getClassName(
                    styles.control,
                    styles.textarea,
                    textareaClassName
                )}
                {...textareaProps}
            />
            {helpText ? <p className={styles.helpText}>{helpText}</p> : null}
        </label>
    )
}

export const SelectField = ({
    children,
    className,
    helpText,
    label,
    selectClassName,
    ...selectProps
}: SelectFieldProps) => {
    return (
        <label className={getClassName(styles.field, className)}>
            <span>{label}</span>
            <select
                className={getClassName(styles.control, selectClassName)}
                {...selectProps}
            >
                {children}
            </select>
            {helpText ? <p className={styles.helpText}>{helpText}</p> : null}
        </label>
    )
}
