export interface Settings {
    fileViewer: FileViewerSettings;
    search: SearchSettings;
    electron: ElectronSettings;
}

export interface FileViewerSettings {
    fullScreen: boolean;
    wrapLines: boolean;
}

export interface SearchSettings {
    rememberLastSearch: boolean;
    enableSearchHistory: boolean;
    historyElementCount: number;
    enableResultHiding: boolean;
    searchResultsView: SearchResultsView;
    showFileHitsCount: boolean;
    showTotalHitsCount: boolean;
    includeArchived: boolean;
    requestRateLimit: number;
    concurrentSearchRequests: number;
    requestRetryCount: number;
    requestRetryDelay: number;
    disableRateLimitOnFile: boolean;
}

export interface ElectronSettings {
    enableUnsafeRequests: boolean;
}

export type SearchResultsView = 'FLAT' | 'TREE' | 'COMPACT_TREE';

export function getDefaultSettings(): Settings {
    return {
        fileViewer: {
            fullScreen: false,
            wrapLines: false
        },
        search: {
            rememberLastSearch: true,
            enableSearchHistory: false,
            historyElementCount: 10,
            enableResultHiding: false,
            searchResultsView: 'FLAT',
            showFileHitsCount: true,
            showTotalHitsCount: true,
            includeArchived: false,
            requestRateLimit: 400,
            concurrentSearchRequests: 5,
            requestRetryCount: 10,
            requestRetryDelay: 10,
            disableRateLimitOnFile: true
        },
        electron: {
            enableUnsafeRequests: false
        }
    };
}

/**
 * Patches missing settings properties with default ones which easies adding new settings properties to new app releases.
 *
 * @param settings settings to patch
 */
export function getSettingsPatchedWithDefaults(settings: Settings) {
    const defaultSettings = getDefaultSettings();

    Object.keys(defaultSettings).forEach(key => {
        defaultSettings[key] = {
            ...defaultSettings[key],
            ...settings[key]
        };
    });

    return defaultSettings;
}
