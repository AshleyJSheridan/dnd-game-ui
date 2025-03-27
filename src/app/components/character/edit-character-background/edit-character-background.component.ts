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
    characteristicsError: boolean = false;

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharacterBackgrounds().subscribe(
            {
                next: (charBackgrounds) => {
                    this.charBackgrounds = charBackgrounds;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
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

    handleCharacteristicRollEvent(rollData: {value: number}, idString: string) {
        // selecting the element like this because the number of select lists is dynamic
        const selectList = <HTMLSelectElement>document.getElementById(idString);
        selectList.selectedIndex = rollData.value;
    }

    setCharBackground(): void {
        this.characteristicsError = false;
        const selectLists = <NodeListOf<HTMLSelectElement>>document.querySelectorAll('select.characteristic');
        let characteristics: Array<number> = [];

        selectLists.forEach(list => {
            if (list.value !== '') {
                characteristics.push(parseInt(list.value));
            }
        });

        if(selectLists.length === characteristics.length) {
            let data = {charBackgroundId: this.selectedCharBackground?.id, characteristics: characteristics};

            // this won't ever be called without a selected background, but coalesce to 0 to keep IDE happy
            this.characterService.setCharacterBackground(this.selectedCharBackground?.id ?? 0, characteristics).subscribe((character) => {
                this.router.navigate([`/characters/${character.guid}/edit/race`]);
            });
        } else {
            this.characteristicsError = true;
        }
    }
}
