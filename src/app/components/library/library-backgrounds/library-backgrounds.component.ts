import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { CharBackgroundIconComponent } from '../../icons/char-background-icon/char-background-icon.component';
import { CharacterBackground } from '../../../entities/CharacterBackground';
import { LibraryService } from '../../../services/library.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-library-backgrounds',
    imports: [
        HeaderComponent,
        CharBackgroundIconComponent,
    ],
    templateUrl: './library-backgrounds.component.html',
})
export class LibraryBackgroundsComponent {
    public backgrounds: Array<CharacterBackground> = [];
    public selectedCharBackground: CharacterBackground|null = null;

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getCharacterBackgrounds().subscribe({
            next: (backgrounds) => {
                this.backgrounds = backgrounds;
            },
            error: (error => {
                this.router.navigate(['/']);
            })
        });
    }

    selectCharBackground(charBackground: CharacterBackground, event: MouseEvent): void {
        this.selectedCharBackground = charBackground;
    }

    getCharacteristicsKeys(): Array<string> {
        if (this.selectedCharBackground?.characteristics !== undefined)
            return Object.keys(this.selectedCharBackground?.characteristics);

        return [];
    }

}
