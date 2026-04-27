import {Component, ViewChild} from '@angular/core';
import { CharacterClass } from '../../../entities/CharacterClass';
import { LibraryService } from '../../../services/library.service';
import { Router } from '@angular/router';
import {HeaderComponent} from '../../header/header.component';
import {CharClassIconComponent} from '../../icons/char-class-icon/char-class-icon.component';
import {LightboxComponent} from '../../dialogs/lightbox/lightbox.component';
import {CharClassFeatureIconComponent} from '../../icons/char-class-feature-icon/char-class-feature-icon.component';

@Component({
    selector: 'app-library-classes',
    imports: [
        HeaderComponent,
        CharClassIconComponent,
        LightboxComponent,
        CharClassFeatureIconComponent
    ],
    templateUrl: './library-classes.component.html',
})
export class LibraryClassesComponent {
    public classes: Array<CharacterClass> = [];
    selectedCharClass: number = 0;

    @ViewChild('classLightbox') classLightbox: LightboxComponent | undefined;

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getCharacterClasses().subscribe({
            next: (classes) => {
                this.classes = classes;
            },
            error: (error => {
                this.router.navigate(['/']);
            })
        });
    }

    selectCharClass(charClassId: number, event: MouseEvent) {
        this.selectedCharClass = charClassId;

        if(event.currentTarget !== null) {
            this.classLightbox?.showModal(event.currentTarget);
        }
    }

    getClassBySelectionId(): CharacterClass {
        if (this.selectedCharClass === 0 || this.classes.length === 0)
            return new CharacterClass();

        return this.classes.filter(charClass => {
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

    hasPathSelection(): boolean {
        for (let i = 0; i < this.getClassBySelectionId()?.class_features.length; i ++) {
            if (this.getClassBySelectionId()?.class_features[i].type === 'path')
                return true;
        }

        return false;
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

    getTools(): Array<{id: number, name: string, type: string}> {
        return this.getClassBySelectionId().tool_proficiencies?.tools ?? [];
    }

    canUserPickFromTools(): boolean {
        const userClass = this.getClassBySelectionId();

        return userClass.tool_proficiencies?.tools?.length > userClass.tool_proficiencies?.max;
    }

    getToolSelectionCount(): number {
        return this.getClassBySelectionId().tool_proficiencies?.max ?? 0;
    }
}
