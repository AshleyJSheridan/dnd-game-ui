import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { ICharacter } from '../../../interfaces/iCharacter';
import { Router, RouterLink } from '@angular/router';
import { EditIconComponent } from '../../icons/edit-icon/edit-icon.component';
import { ViewIconComponent } from '../../icons/view-icon/view-icon.component';
import { DeleteIconComponent } from '../../icons/delete-icon/delete-icon.component';
import { HeaderComponent } from '../../header/header.component';

@Component({
    selector: 'app-characters-list',
    imports: [
        RouterLink,
        EditIconComponent,
        ViewIconComponent,
        DeleteIconComponent,
        HeaderComponent
    ],
    templateUrl: './characters-list.component.html'
})
export class CharactersListComponent {
    public characters: Array<ICharacter> = [];

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit() {
        this.characterService.getCharacters().subscribe(
            {
                next: (characters: ICharacter[]) => {
                    this.characters = characters;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    deleteCharacterHandler(charGuid: string): void {
        // TODO call the DELETE endpoint for this
        console.log(charGuid);
    }
}
