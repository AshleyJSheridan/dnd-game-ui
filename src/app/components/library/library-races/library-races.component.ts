import { Component } from '@angular/core';
import {HeaderComponent} from '../../header/header.component';
import {LibraryService} from '../../../services/library.service';
import {Router} from '@angular/router';
import {CharacterRace} from '../../../entities/CharacterRace';
import {
    EditCharacterRaceDetailsComponent
} from '../../character/edit-character-race-details/edit-character-race-details.component';

@Component({
    selector: 'app-library-races',
    imports: [
        HeaderComponent,
        EditCharacterRaceDetailsComponent
    ],
    templateUrl: './library-races.component.html',
})
export class LibraryRacesComponent {
    public races: Array<CharacterRace> = [];

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getCharacterRaces().subscribe({
            next: (races) => {
                this.races = races;

                this.races.forEach((race) => {
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
        });
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
}
