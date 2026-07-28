import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { LibraryService } from '../../../services/library.service';
import { Router } from '@angular/router';
import { DamageType } from '../../../entities/DamageType';

@Component({
    selector: 'app-library-damage-types',
    imports: [
        HeaderComponent,
    ],
    templateUrl: './library-damage-types.component.html',
})
export class LibraryDamageTypesComponent {
    public damageTypes: Array<DamageType> = [];

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getDamageTypes().subscribe({
            next: (damageTypes) => {
                this.damageTypes = damageTypes;
            },
            error: (error => {
                this.router.navigate(['/']);
            })
        });
    }
}
