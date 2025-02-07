import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import {Character} from '../../../entities/Character';

@Component({
    selector: 'app-edit-character-abilities',
    imports: [],
    templateUrl: './edit-character-abilities.component.html'
})
export class EditCharacterAbilitiesComponent {
    character: Character | undefined;
    abilityDiceRolls: Array<{guid:string;rolls:Array<number>;}> = Array(6).fill({guid:'',rolls:[]});
    assignedDiceTotals: Array<{guid:string;total:number}> = [];

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharacter().subscribe((character) => {
            this.character = character;
        });
    }

    getAbilityModifier(ability: {base: number; racialModifier: number;}): string {
        const modifierValue = Math.floor((ability.base + ability.racialModifier - 10) / 2);

        return new Intl.NumberFormat('en-GB', {
            signDisplay: "always"
        }).format(modifierValue);
    }

    getDiceRollForStat(): void {
        for (let i = 0; i < 6; i ++) {
            this.characterService.getAbilityRoll().subscribe(rolls => {
                this.abilityDiceRolls[i] = {guid: rolls.guid, rolls: rolls.rolls.d6?.sort().reverse() ?? []};
            })
        }
    }
}
