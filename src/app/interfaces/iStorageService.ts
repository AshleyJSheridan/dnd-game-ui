export interface IStorageService {
    setItem(key: string, data: string): boolean;

    getItem(key: string): string;

    hasItem(key: string): boolean;
}
