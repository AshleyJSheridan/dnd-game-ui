import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { CharacterRace } from '../../../entities/CharacterRace';
import { EditCharacterRaceDetailsComponent } from '../edit-character-race-details/edit-character-race-details.component';
import { Router } from '@angular/router';

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

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharacterRaces().subscribe(
            {
                next: (charRaces) => {
                    this.charRaces = charRaces;

                    this.charRaces.forEach((race) => {
                        race.randomDisplayGender = this.getRandomGender();

                        if (race.sub_races.length > 0) {
                            race.sub_races.forEach((sub_race) => {
                                sub_race.randomDisplayGender = this.getRandomGender();
                            })
                        }
                    });
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    getRandomGender(): string {
        return (Math.random() < .5) ? 'male' : 'female';
    }

    getPortraitImage(race: CharacterRace): string {
        const raceName = race.name;
        return `${race.randomDisplayGender}-${raceName.replace(/ /g, '-').replace(/[\(\)]/g, '').toLowerCase()}`;
    }

    hasSubRaces(race: CharacterRace): boolean {
        return race.sub_races?.length > 0;
    }

    getSubRaceCount(race: CharacterRace): number {
        return race.sub_races?.length;
    }

    handleSelectCharRace(charRace: CharacterRace): void {
        this.characterService.setCharacterRace(charRace.id).subscribe((character) => {
            this.router.navigate([`/characters/${character.guid}/edit/abilities`]);
        });
    }
}
