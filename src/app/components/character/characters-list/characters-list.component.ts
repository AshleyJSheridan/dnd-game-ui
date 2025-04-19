import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { EditIconComponent } from '../../icons/edit-icon/edit-icon.component';
import { ViewIconComponent } from '../../icons/view-icon/view-icon.component';
import { DeleteIconComponent } from '../../icons/delete-icon/delete-icon.component';
import { HeaderComponent } from '../../header/header.component';
import { Character } from '../../../entities/Character';
import { PortraitComponent } from '../portrait/portrait.component';

@Component({
    selector: 'app-characters-list',
    imports: [
        RouterLink,
        EditIconComponent,
        ViewIconComponent,
        DeleteIconComponent,
        HeaderComponent,
        PortraitComponent,
        RouterLinkActive
    ],
    templateUrl: './characters-list.component.html'
})
export class CharactersListComponent {
    public characters: Array<Character> = [];
    success: boolean = false;
    error: string = '';

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit() {
        this.characterService.getCharacters().subscribe(
            {
                next: (characters: Character[]) => {
                    this.characters = characters;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    deleteCharacterHandler(charGuid: string): void {
        this.success = false;
        this.error = '';

        this.characterService.deleteCharacter(charGuid).subscribe({
            next: (characters) => {
                this.characters = characters;
                this.success = true;
            },
            error: (error) => {
                this.error = 'There was a problem deleting your character';
            }
        })
    }

    getImageUrl(charGuid: string): string {
        return `${this.characterService.apiUrl}/characters/${charGuid}/portrait`;
    }
}
