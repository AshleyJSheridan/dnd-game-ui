import { Component } from '@angular/core';

@Component({
    selector: 'app-edit-portrait',
    imports: [],
    templateUrl: './edit-portrait.component.html'
})
export class EditPortraitComponent {
    fileName: string = '';
    file: File | undefined;
    fileError: string = '';

    onFileSelected(event: Event): void {
        this.fileError = '';

        // @ts-ignore
        this.file = event.target?.files[0] as File;
        this.fileName = this.file.name;
    }

    public updatePortraitHandler(): void {

    }
}
