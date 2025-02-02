import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { CharacterBackground } from '../../../entities/CharacterBackground';
import { CharBackgroundIconComponent } from '../../icons/char-background-icon/char-background-icon.component';
import { DiceComponent } from '../../dice/dice.component';

@Component({
    selector: 'app-edit-character-background',
    imports: [
        CharBackgroundIconComponent,
        DiceComponent
    ],
    templateUrl: './edit-character-background.component.html'
})
export class EditCharacterBackgroundComponent {
    charBackgrounds: Array<CharacterBackground> = [];
    selectedCharBackground: CharacterBackground|null = null;

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharacterBackgrounds().subscribe((charBackgrounds) => {
            this.charBackgrounds = charBackgrounds;
        });
    }

    selectCharBackground(charBackground: CharacterBackground, event: MouseEvent): void {
        this.selectedCharBackground = charBackground;
    }

    getCharacteristicsKeys(): Array<string> {
        if (this.selectedCharBackground?.characteristics !== undefined)
            return Object.keys(this.selectedCharBackground?.characteristics);

        return [];
    }

    getCharacteristicIdString(characteristic: string): string {
        return characteristic.toLowerCase().replace(' ', '-');
    }

    handleRollEvent(rollData: {value: number}, idString: string) {
        const selectList = <HTMLSelectElement>document.getElementById(idString);
        selectList.selectedIndex = rollData.value;
    }
}
