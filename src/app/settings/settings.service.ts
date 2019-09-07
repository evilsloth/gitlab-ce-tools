import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { getDefaultSettings, Settings } from './settings';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private static readonly SETTINGS_STORAGE_KEY = 'stgs';
    private settings$: BehaviorSubject<Settings>;

    constructor() {
        const settings = this.getSettingsFromStorage();
        this.settings$ = new BehaviorSubject<Settings>(settings);
    }

    getSettings(): Observable<Settings> {
        return this.settings$;
    }

    getCurrentSettings(): Settings {
        return this.settings$.value;
    }

    updateSettings(settings: Settings) {
        this.saveSettingsInStorage(settings);
        this.settings$.next(settings);
    }

    private getSettingsFromStorage(): Settings {
        const savedSettings = localStorage.getItem(SettingsService.SETTINGS_STORAGE_KEY);
        return savedSettings ? JSON.parse(savedSettings) : getDefaultSettings();
    }

    private saveSettingsInStorage(settings: Settings) {
        localStorage.setItem(SettingsService.SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
}
