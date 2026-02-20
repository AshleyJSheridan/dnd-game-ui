import { Component } from '@angular/core';
import { CreateNavComponent } from '../create-nav/create-nav.component';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
    imports: [
        CreateNavComponent,
        HeaderComponent,
        FormsModule
    ],
  templateUrl: './create.component.html'
})
export class CreateComponent {
    charLevel: number = 1;
    charName: string = '';
    suggestionType: string = 'generic';
    suggestions: Array<string> = [];

    constructor(private characterService: CharacterService, private router: Router) {}

    suggestNamesHandler(): void {
        this.characterService.getNameSuggestions(this.suggestionType).subscribe((names) => {
            this.suggestions = names.names;
        });
    }

    selectSuggestionHandler(name: string): void {
        this.charName = name;
    }

    submitHandler() {
        if(this.charName === '')
            return;

        let characterData = {charName: this.charName, charLevel: this.charLevel};
        this.characterService.createCharacter(characterData).subscribe({
            next: (character) => {
                this.router.navigate([`/characters/${character.guid}/edit/class`]);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}
