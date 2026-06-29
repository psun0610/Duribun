'use client'

import { useEffect, useState, type ChangeEvent, type CSSProperties } from 'react'
import { Camera } from 'lucide-react'

import type { AvatarFileFieldProps } from './types/profileSetupForm.types'

import styles from './ProfileSetupForm.module.scss'

export const AvatarFileField = ({
    initialAvatarUrl,
    inputId,
    label,
}: AvatarFileFieldProps) => {
    const [previewUrl, setPreviewUrl] = useState(initialAvatarUrl)

    useEffect(() => {
        return () => {
            if (previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const previewStyle: CSSProperties | undefined = previewUrl
        ? {
              backgroundImage: `url("${previewUrl.replaceAll('"', '%22')}")`,
          }
        : undefined

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        setPreviewUrl(previousPreviewUrl => {
            if (previousPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previousPreviewUrl)
            }

            return URL.createObjectURL(file)
        })
    }

    return (
        <div className={styles.avatarPicker}>
            <input
                accept="image/*"
                className={styles.avatarFileInput}
                id={inputId}
                name="avatarFile"
                onChange={handleAvatarChange}
                type="file"
            />
            <label className={styles.avatarPickerPreview} htmlFor={inputId}>
                <span
                    aria-hidden="true"
                    className={styles.avatarPreview}
                    style={previewStyle}
                >
                    {previewUrl ? null : (
                        <span className={styles.avatarPreviewFallback}>
                            <Camera aria-hidden="true" size={34} />
                        </span>
                    )}
                </span>
                <span className={styles.avatarPickerLabel}>{label}</span>
            </label>
        </div>
    )
}
