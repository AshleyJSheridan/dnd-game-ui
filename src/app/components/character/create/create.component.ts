import { Component } from '@angular/core';
import { CreateNavComponent } from '../create-nav/create-nav.component';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../../services/character.service';

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

    constructor(private characterService: CharacterService) {}

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

        // TODO type this
        let data = {charName: this.charName, charLevel: this.charLevel};
        this.characterService.createCharacter(data).subscribe((response) => {
            console.log(response)
        });
    }
}
