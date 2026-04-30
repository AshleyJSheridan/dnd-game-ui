import { Component } from '@angular/core';
import { Deity } from '../../../entities/Deity';
import { LibraryService } from '../../../services/library.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';

@Component({
    selector: 'app-library-deities',
    imports: [
        HeaderComponent
    ],
    templateUrl: './library-deities.component.html',
})
export class LibraryDeitiesComponent {
    public deities: Array<Deity> = [];

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getDeities().subscribe({
            next: (deities) => {
                this.deities = deities;
            },
            error: (error => {
                this.router.navigate(['/']);
            })
        });
    }
}
