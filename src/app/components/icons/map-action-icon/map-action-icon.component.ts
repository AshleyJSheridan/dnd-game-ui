import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';

@Component({
    selector: 'app-map-action-icon',
    imports: [],
    templateUrl: './map-action-icon.component.html'
})
export class MapActionIconComponent {
    readonly mapAction: InputSignal<string> = input<string>('');
    readonly currentMapMode: InputSignal<string> = input<string>('');
    @Output() mapMode = new EventEmitter();

    setMapMode(mode: string): void {
        this.mapMode.emit(mode);
    }
}
