import { Component, input, InputSignal } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Character } from '../../../entities/Character';

@Component({
    selector: 'app-portrait',
    imports: [],
    templateUrl: './portrait.component.html',
})
export class PortraitComponent {
    readonly character: InputSignal<Character|undefined> = input();

    constructor(private characterService: CharacterService) {}

    getImageUrl(character: InputSignal<Character | undefined>): string {
        if (character() && character()?.custom_portrait) {
            return `${this.characterService.apiUrl}/characters/${character()?.guid}/portrait`;
        } else {
            return 'images/silhouette.png';
        }
    }
}
