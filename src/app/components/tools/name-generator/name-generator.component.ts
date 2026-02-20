import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CharacterService } from '../../../services/character.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-name-generator',
    imports: [
        HeaderComponent,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './name-generator.component.html'
})
export class NameGeneratorComponent {
    suggestionType: string = 'generic';
    suggestions: Array<string> = [];

    constructor(private characterService: CharacterService) {}

    submitHandler(event: Event): void {
        this.suggestions = [];

        this.characterService.getNameSuggestions(this.suggestionType).subscribe({
            next: (names) => {
                this.suggestions = names.names;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}
