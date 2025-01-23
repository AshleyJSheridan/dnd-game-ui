import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { ICharacter } from '../../../interfaces/iCharacter';
import { RouterLink } from '@angular/router';
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

    constructor(private characterService: CharacterService) {}

    ngOnInit() {
        this.characterService.getCharacters().subscribe((data) => {
            this.characters = data.data;
        });
    }

    deleteCharacterHandler(charGuid: string): void {
        console.log(charGuid);
    }
}
