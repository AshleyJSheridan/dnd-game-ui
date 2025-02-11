import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { Language } from '../../../entities/Language';
import { Character } from '../../../entities/Character';
import {LanguageScriptComponent} from '../../icons/language-script/language-script.component';

@Component({
    selector: 'app-edit-character-languages',
    imports: [
        LanguageScriptComponent
    ],
    templateUrl: './edit-character-languages.component.html'
})
export class EditCharacterLanguagesComponent {
    allLanguages: Array<Language> = [];
    character: Character | undefined;
    selectedLanguages: Array<Language> = [];
    selectError: boolean = false;

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getLanguages().subscribe((languages) => {
            this.allLanguages = languages;
        });

        this.characterService.getCharacter().subscribe((character) => {
            this.character = character;
        });
    }

    getAvailableLangCount(): number {
        return (this.character?.languages.available ?? 0) - (this.character?.languages?.known?.length ?? 0);
    }

    languageAlreadyKnown(languageId: number): boolean {
        if (this.character?.languages?.known) {
            return this.character?.languages?.known.map(lang => {
                return lang.id === languageId
            })[0];
        }

        return false;
    }

    selectLanguage(language: Language): void {
        // deselect if selected
        if (this.isSelected(language)) {
            const index = this.selectedLanguages.indexOf(language);
            this.selectedLanguages.splice(index, 1);
        } else {
            if (this.selectedLanguages.length < this.getAvailableLangCount()) {
                this.selectedLanguages.push(language);
            }
        }
    }

    isSelected(language: Language): boolean {
        return this.selectedLanguages.includes(language);
    }

    confirmLanguageSelection(): void {
        if (this.selectedLanguages.length === this.getAvailableLangCount()) {
            let languages = this.selectedLanguages.map(lang => {return lang.id});

            this.characterService.setLanguages(languages).subscribe(character => {
                this.router.navigate([`/characters/${character.guid}/edit/spells`]);
            })
        } else {
            this.selectError = true;
        }
    }
}
