import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import {ICharacterClassList} from '../../../interfaces/iCharacterClassList';
import {ICharacterClass} from '../../../interfaces/iCharacterClass';
import {CharClassIconComponent} from '../../icons/char-class-icon/char-class-icon.component';
import {ConfirmComponent} from '../../dialogs/confirm/confirm.component';
import {CharacterClass} from '../../../entities/CharacterClass';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-edit-character-class',
    imports: [
        CharClassIconComponent,
        ConfirmComponent,
        CommonModule
    ],
    templateUrl: './edit-character-class.component.html'
})
export class EditCharacterClassComponent {
    charClasses: Array<CharacterClass> = [];
    selectedCharClass: number = 5;
    test = '<b>wtf</b>';

    constructor(private characterService: CharacterService) {}

    ngOnInit() {
        this.characterService.getCharacterClasses().subscribe((charClasses) => {
           this.charClasses = charClasses;
           console.log(charClasses)
        });
    }

    selectCharClass(charClassId: number) {
        this.selectedCharClass = charClassId;
    }

    getClassBySelectionId(): CharacterClass {
        if (this.selectedCharClass === 0 || this.charClasses.length === 0)
            return new CharacterClass();

        return this.charClasses.filter(charClass => {
            return charClass.id === this.selectedCharClass;
        })[0];
    }

    getPrimaryAbilityStrings(): Array<string> {
        if(this.getClassBySelectionId().primary_abilities.length === 1) {
            return ['Primary ability', this.getClassBySelectionId().primary_abilities[0].name];
        }

        return ['Primary abilities',
            this.getClassBySelectionId().primary_abilities.map(ability => {
                return ability.name
            }).join(' & ')
        ];
    }

    getSavingThrows(): string {
        return this.getClassBySelectionId().saving_throws.map(ability => {
            return ability.name
        }).join(' & ')
    }

    getLevelSuffix(level: number): string {
        const suffix = ['th', 'st', 'nd', 'rd'];
        if (level % 10 == 1 && level % 100 != 11)
            return "st";

        if (level % 10 == 2 && level % 100 != 12)
            return "nd";

        if (level % 10 == 3 && level % 100 != 13)
            return "rd";

        return suffix[0];
    }
}
