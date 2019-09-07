export interface Settings {
    fileViewer: FileViewerSettings;
}

export interface FileViewerSettings {
    fullScreen: boolean;
    wrapLines: boolean;
}

export function getDefaultSettings(): Settings {
    return {
        fileViewer: {
            fullScreen: false,
            wrapLines: false
        }
    };
}
