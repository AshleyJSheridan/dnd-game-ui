import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import {CharacterBackground} from '../../../entities/CharacterBackground';

@Component({
    selector: 'app-edit-character-background',
    imports: [],
    templateUrl: './edit-character-background.component.html'
})
export class EditCharacterBackgroundComponent {
    private charBackgrounds: Array<CharacterBackground> = [];
    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharacterBackgrounds().subscribe((charBackgrounds) => {
            this.charBackgrounds = charBackgrounds;
        });
    }
}
