import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import {ICharacterClassList} from '../../../interfaces/iCharacterClassList';
import {ICharacterClass} from '../../../interfaces/iCharacterClass';
import {CharClassIconComponent} from '../../icons/char-class-icon/char-class-icon.component';

@Component({
    selector: 'app-edit-character-class',
    imports: [
        CharClassIconComponent
    ],
    templateUrl: './edit-character-class.component.html'
})
export class EditCharacterClassComponent {
    charClasses: Array<ICharacterClass> = [];
    selectedCharClass: number = 0;

    constructor(private characterService: CharacterService) {}

    ngOnInit() {
        this.characterService.getCharacterClasses().subscribe((charClasses) => {
           this.charClasses = charClasses;
        });
    }
}
