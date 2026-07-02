import type { ActiveTab, ViewMode } from '../types/couplePlaceApp.types'

const APP_ROOT_PATH = '/app'
const APP_TAB_PATHS: Record<ActiveTab, string> = {
    explore: `${APP_ROOT_PATH}/explore`,
    friends: `${APP_ROOT_PATH}/friends`,
    places: `${APP_ROOT_PATH}/places`,
    settings: `${APP_ROOT_PATH}/settings`,
}

const getViewSearchSuffix = (viewMode?: ViewMode) => {
    if (viewMode !== 'list') {
        return ''
    }

    return '?view=list'
}

export const getAppTabHref = (tab: ActiveTab) => {
    return APP_TAB_PATHS[tab]
}

export const getAppPlacesHref = (viewMode?: ViewMode) => {
    return `${APP_TAB_PATHS.places}${getViewSearchSuffix(viewMode)}`
}

export const getAppAddPlaceHref = (viewMode?: ViewMode) => {
    return `${APP_TAB_PATHS.places}/new${getViewSearchSuffix(viewMode)}`
}

export const getAppReviewWriterHref = (
    couplePlaceId: string,
    viewMode?: ViewMode
) => {
    return `${APP_TAB_PATHS.places}/${couplePlaceId}/review/new${getViewSearchSuffix(viewMode)}`
}

export const getAppReviewDetailHref = (
    couplePlaceId: string,
    viewMode?: ViewMode
) => {
    return `${APP_TAB_PATHS.places}/${couplePlaceId}/review${getViewSearchSuffix(viewMode)}`
}

export const parseAppViewMode = (value: string | null | undefined): ViewMode => {
    return value === 'list' ? 'list' : 'feed'
}
