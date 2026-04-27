import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { Language } from '../../../entities/Language';
import { LibraryService } from '../../../services/library.service';
import { Router } from '@angular/router';
import { LanguageScriptComponent } from '../../icons/language-script/language-script.component';

@Component({
    selector: 'app-library-languages',
    imports: [
        HeaderComponent,
        LanguageScriptComponent
    ],
    templateUrl: './library-languages.component.html',
})
export class LibraryLanguagesComponent {
    public languages: Array<Language> = [];

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getCharacterLanguages().subscribe({
            next: (languages) => {
                this.languages = languages;
            },
            error: (error => {
                this.router.navigate(['/']);
            })
        });
    }
}
