import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SettingsService } from 'src/app/settings/settings.service';

@Injectable({
    providedIn: 'root'
})
export class HistoryStoreService {

    private static readonly STORAGE_KEY = 'history';

    private enabled: boolean;

    private limit: number;

    private historySubject: BehaviorSubject<string[]>;
    history$: Observable<string[]>;

    constructor(private settingsService: SettingsService) {
        const history = this.getHistoryFromStorage();
        this.historySubject = new BehaviorSubject<string[]>(history);
        this.history$ = this.historySubject.asObservable();
        this.settingsService.getSettings().subscribe((settings) => {
            this.limit = settings.search.historyElementCount;
            this.enabled = settings.search.enableSearchHistory;

            if (!this.enabled) {
                this.clear();
            }

            if (this.historySubject.value.length > this.limit) {
                this.updateHistory(this.historySubject.value.slice(0, this.limit));
            }
        });
    }

    add(element: string) {
        if (!this.enabled) {
            return;
        }

        const history = this.historySubject.value;
        const index = history.indexOf(element);
        if (index !== -1) {
            history.splice(index, 1);
        }

        if (history.length >= this.limit) {
            history.pop();
        }

        history.unshift(element);
        this.updateHistory(history);
    }

    clear(): void {
        this.updateHistory([]);
    }

    private updateHistory(history: string[]) {
        this.historySubject.next(history);
        this.saveHistoryInStorage(history);
    }

    private getHistoryFromStorage(): string[] {
        const history = localStorage.getItem(HistoryStoreService.STORAGE_KEY);
        const parsedHistory = JSON.parse(history);
        return parsedHistory || [];
    }

    private saveHistoryInStorage(history: string[]) {
        localStorage.setItem(HistoryStoreService.STORAGE_KEY, JSON.stringify(history));
    }

}
