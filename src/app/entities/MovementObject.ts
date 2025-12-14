import { Character } from './Character';

export class MovementObject {
    target: SVGElement | null = null;
    entityGuid: string = '';
    entityType: string  = '';
    elementStartX: number = 0;
    elementStartY: number = 0;
    startX: number = 0;
    startY: number = 0;
    endX: number = 0;
    endY: number = 0;
    inMotion: boolean = false;

    hasObjectSelected(): boolean {
        return this.target !== null;
    }
}
