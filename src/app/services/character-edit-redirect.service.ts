import { Injectable } from '@angular/core';
import { CharacterService } from './character.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class CharacterEditRedirectService {
    constructor(private characterService: CharacterService, private router: Router, private authService: AuthService) {}

    redirectToCorrectEditLocation(): void {
        this.characterService.getCharacter().subscribe({
            next: (character) => {
                if (character.guid) {
                    this.characterService.setCharacter(character);

                    // redirect based on first instance of missing character information
                    if (character.charClass === '') {
                        this.router.navigate([`/characters/${character.guid}/edit/class`]);
                    } else if (character.charBackground.name === '') {
                        this.router.navigate([`/characters/${character.guid}/edit/background`]);
                    } else if (character.charRace === '') {
                        this.router.navigate([`/characters/${character.guid}/edit/race`]);
                    } else if (character.skills?.known.length === 0) {
                        this.router.navigate([`/characters/${character.guid}/edit/skills`]);
                    } else if (character.abilities[0].base === 0) {
                        this.router.navigate([`/characters/${character.guid}/edit/abilities`]);
                    } else if (character.languages.known.length < character.languages.available) {
                        this.router.navigate([`/characters/${character.guid}/edit/languages`]);
                    } else if (character.magic.hasMagic) {
                        //this.router.navigate([`/characters/${character.guid}/edit/spells`]);
                    }
                }
            },
            error: (error) => {
                switch (error.status) {
                    case 401:
                        this.authService.refreshToken();
                        break;
                    default:
                        console.error('There was an unexpected error. Please try again later.');
                }
            }
        });
    }
}
