import { Component } from '@angular/core';
import {CharacterService} from '../../../services/character.service';
import {CharacterRace} from '../../../entities/CharacterRace';
import {EditCharacterRaceDetailsComponent} from '../edit-character-race-details/edit-character-race-details.component';

@Component({
    selector: 'app-edit-character-race',
    imports: [
        EditCharacterRaceDetailsComponent
    ],
    templateUrl: './edit-character-race.component.html'
})
export class EditCharacterRaceComponent {
    charRaces: Array<CharacterRace> = [];
    selectedCharRace: CharacterRace|null = null;
    identifyAs: string = 'female';

    constructor(private characterService: CharacterService) {}

    ngOnInit(): void {
        this.characterService.getCharacterRaces().subscribe((charRaces) => {
            this.charRaces = charRaces;
        });

        this.identifyAs = this.getRandomGender();
    }

    selectCharRace(charRace: CharacterRace) {
        this.selectedCharRace = charRace;
    }

    getRandomGender(): string {
        return (Math.random() < .5) ? 'male' : 'female';
    }

    getPortraitImage(race: string): string {
        return `${this.identifyAs}-${race.replace(/ /g, '-').replace(/[\(\)]/g, '').toLowerCase()}`;
    }

    hasSubRaces(race: CharacterRace): boolean {
        return race.sub_races?.length > 0;
    }

    getSubRaceCount(race: CharacterRace): number {
        return race.sub_races?.length;
    }
}
