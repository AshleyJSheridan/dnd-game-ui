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
    charName: string = '';
    suggestionType: string = 'generic';
    suggestions: Array<string> = [];

    constructor(private characterService: CharacterService) {}

    suggestNamesHandler() {
        this.characterService.getNameSuggestions(this.suggestionType).subscribe((data) => {
            this.suggestions = data.data.names;
        });
    }

    selectSuggestionHandler(name: string) {
        this.charName = name;
    }
}
