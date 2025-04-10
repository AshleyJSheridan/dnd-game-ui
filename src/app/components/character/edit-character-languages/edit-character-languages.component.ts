import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { Language } from '../../../entities/Language';
import { Character } from '../../../entities/Character';
import { LanguageScriptComponent } from '../../icons/language-script/language-script.component';

@Component({
    selector: 'app-edit-character-languages',
    imports: [
        LanguageScriptComponent
    ],
    templateUrl: './edit-character-languages.component.html'
})
export class EditCharacterLanguagesComponent {
    allLanguages: Array<Language> = [];
    selectedLanguages: Array<Language> = [];
    selectError: boolean = false;

    constructor(public characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getLanguages().subscribe(
            {
                next: (languages) => {
                    this.allLanguages = languages;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    getAvailableLangCount(): number {
        return (this.characterService.character?.languages.available ?? 0) - (this.characterService.character?.languages?.known?.length ?? 0);
    }

    languageAlreadyKnown(languageId: number): boolean {
        let known = false;

        if (this.characterService.character?.languages?.known) {
            if (this.characterService.character?.languages?.known.filter(lang => {
                return lang.id === languageId
            }).length > 0)
                known = true;
        }

        if (!known && this.characterService.character?.languages?.racial) {
            if (this.characterService.character?.languages?.racial.filter(lang => {
                return lang.id === languageId
            }).length > 0)
                known = true;
        }

        if (!known && this.characterService.character?.languages?.class) {
            if (this.characterService.character?.languages?.class.filter(lang => {
                return lang.id === languageId
            }).length > 0)
                known = true;
        }

        return known;
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
