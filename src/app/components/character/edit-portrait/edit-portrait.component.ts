import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import {Character} from '../../../entities/Character';
import {PortraitComponent} from '../portrait/portrait.component';

@Component({
    selector: 'app-edit-portrait',
    imports: [
        PortraitComponent
    ],
    templateUrl: './edit-portrait.component.html'
})
export class EditPortraitComponent {
    fileName: string = '';
    file: File | undefined;
    fileError: string = '';
    character: Character | undefined = undefined;

    constructor(public characterService: CharacterService) {}

    onFileSelected(event: Event): void {
        this.fileError = '';

        // @ts-ignore
        this.file = event.target?.files[0] as File;
        this.fileName = this.file.name;
    }

    public updatePortraitHandler(): boolean {
        this.fileError = '';

        if (!this.file) {
            this.fileError = 'Please select a file to upload.';
            return false;
        }

        this.characterService.setCharacterPortrait(this.file).subscribe({
            next: (character) => {
                this.characterService.character = character;
            },
            error: (error) => {
                this.fileError = 'There was an error uploading the file. Please try again.';
            }
        })

        return false;
    }

    getPreview(file: File): string {
        return URL.createObjectURL(file);
    }
}
