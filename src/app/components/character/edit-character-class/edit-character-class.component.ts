import { Component, inject, ViewChild } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { CharClassIconComponent } from '../../icons/char-class-icon/char-class-icon.component';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { CharacterClass } from '../../../entities/CharacterClass';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {CharClassFeatureIconComponent} from '../../icons/char-class-feature-icon/char-class-feature-icon.component';
import {Character} from '../../../entities/Character';

@Component({
    selector: 'app-edit-character-class',
    imports: [
        CharClassIconComponent,
        ConfirmComponent,
        CommonModule,
        CharClassFeatureIconComponent
    ],
    templateUrl: './edit-character-class.component.html'
})
export class EditCharacterClassComponent {
    charClasses: Array<CharacterClass> = [];
    character: Character | undefined;
    selectedCharClass: number = 0;
    selectPathError: boolean = false;

    @ViewChild('confirmComponent') confirm: ConfirmComponent | undefined;

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharacter().subscribe((character) => {
            this.character = character;
        });

        this.characterService.getCharacterClasses().subscribe((charClasses) => {
           this.charClasses = charClasses;
        });
    }

    selectCharClass(charClassId: number, event: MouseEvent) {
        this.selectedCharClass = charClassId;

        if(event.currentTarget !== null) {
            this.confirm?.showModal(event.currentTarget);
        }
    }

    getClassBySelectionId(): CharacterClass {
        if (this.selectedCharClass === 0 || this.charClasses.length === 0)
            return new CharacterClass();

        return this.charClasses.filter(charClass => {
            return charClass.id === this.selectedCharClass;
        })[0];
    }

    getPrimaryAbilityStrings(): Array<string> {
        const userClass = this.getClassBySelectionId();

        if(userClass.primary_abilities.length === 1) {
            return ['Primary ability', userClass.primary_abilities[0].name];
        }

        return ['Primary abilities',
            userClass.primary_abilities.map(ability => {
                return ability.name
            }).join(' & ')
        ];
    }

    getSavingThrows(): string {
        return this.getClassBySelectionId().saving_throws.map(ability => {
            return ability.name
        }).join(' & ')
    }

    getArmorProficiencies(): string {
        return this.getClassBySelectionId().armour_proficiencies.map(proficiency => {
            return proficiency.name
        }).join(', ');
    }

    getWeaponProficiencies(): string {
        return this.getClassBySelectionId().weapon_proficiencies.map(proficiency => {
            return proficiency.name
        }).join(', ');
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

    canUserPickFromTools(): boolean {
        const userClass = this.getClassBySelectionId();

        return userClass.tool_proficiencies?.tools?.length > userClass.tool_proficiencies?.max;
    }

    getToolSelectionCount(): number {
        return this.getClassBySelectionId().tool_proficiencies?.max ?? 0;
    }

    getTools(): Array<{id: number, name: string, type: string}> {
        return this.getClassBySelectionId().tool_proficiencies?.tools ?? [];
    }

    confirmSelectedClass(): void {
        this.selectPathError = false;
        let selectedPath = 0;

        // check if this has path selection, and if so, check that a path has been selected
        // then pass that data (or none if it doesn't exist) to the backend
        if (this.hasPathSelection()) {
            const path = <HTMLInputElement>document.querySelector(`input[name=path-${this.selectedCharClass}]:checked`);

            if (!path) {
                this.selectPathError = true;
                return;
            }

            selectedPath = parseInt(path.value);
            this.confirm?.cancelModal();
        }

        this.characterService.setCharacterClass({charClassId: this.selectedCharClass, classPathId: selectedPath}).subscribe((character) => {
            this.router.navigate([`/characters/${character.guid}/edit/background`]);
        });
    }

    hasPathSelection(): boolean {
        const level = this.character?.level ?? 0;

        for (let i = 0; i < this.getClassBySelectionId()?.class_features.length; i ++) {
            if (( + 1) > level)
                break;

            if (this.getClassBySelectionId()?.class_features[i].type === 'path')
                return true;
        }

        return false;
    }
}
