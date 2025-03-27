import { Injectable } from '@angular/core';
import { IStorageService } from '../interfaces/iStorageService';

@Injectable({providedIn: 'root'})
export class LocalStorageService implements IStorageService {
    private _window;
    constructor() {
        this._window = window;
    }

    public setItem(key: string, data: string): boolean {
        try {
            if(this.hasItem(key)) {
                this._window.localStorage.removeItem(key);
            }

            this._window.localStorage.setItem(key, data);

            return true;
        } catch(e) {
            return false;
        }
    }

    public getItem(key: string): string {
        try {
            return this._window.localStorage.getItem(key) ?? '';
        } catch(e) {
            return '';
        }
    }

    public hasItem(key: string): boolean {
        try {
            let data = this.getItem(key);

            return data.length > 0;
        } catch(e) {
            return false;
        }
    }

    public removeItem(key: string): void {
        this._window.localStorage.removeItem(key);
    }
}
