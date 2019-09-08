export interface Settings {
    fileViewer: FileViewerSettings;
    search: SearchSettings;
}

export interface FileViewerSettings {
    fullScreen: boolean;
    wrapLines: boolean;
}

export interface SearchSettings {
    rememberLastSearch: boolean;
}

export function getDefaultSettings(): Settings {
    return {
        fileViewer: {
            fullScreen: false,
            wrapLines: false
        },
        search: {
            rememberLastSearch: true
        }
    };
}

/**
 * Patches missing settings properties with default ones which easies adding new settings properties to new app releases.
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
