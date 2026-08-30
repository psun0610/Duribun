'use client'

import { useEffect, useState, type ChangeEvent, type CSSProperties } from 'react'
import { Camera, User } from 'lucide-react'

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
                            <User aria-hidden="true" size={52} />
                        </span>
                    )}
                </span>
                <span aria-hidden="true" className={styles.avatarCameraBadge}>
                    <Camera aria-hidden="true" size={18} />
                </span>
                <span className={styles.avatarPickerLabel}>{label}</span>
            </label>
        </div>
    )
}
