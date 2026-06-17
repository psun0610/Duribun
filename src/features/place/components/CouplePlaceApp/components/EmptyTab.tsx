import type { EmptyTabProps } from '../types/couplePlaceAppComponent.types'

export const EmptyTab = ({ description, icon: Icon, title }: EmptyTabProps) => {
    return (
        <section className="space-y-5 py-20 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-secondary shadow-2xl">
                <Icon className="h-12 w-12 text-white" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mx-auto max-w-xs text-[15px] font-normal leading-6 text-muted-foreground">
                    {description}
                </p>
            </div>
        </section>
    )
}
