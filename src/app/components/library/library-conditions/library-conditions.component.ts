import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { LibraryService } from '../../../services/library.service';
import { Router } from '@angular/router';
import { Condition } from '../../../entities/Condition';
import {ConditionIconComponent} from '../../icons/condition-icon/condition-icon.component';

@Component({
    selector: 'app-library-conditions',
    imports: [
        HeaderComponent,
        ConditionIconComponent
    ],
    templateUrl: './library-conditions.component.html',
})
export class LibraryConditionsComponent {
    public conditions: Array<Condition> = [];

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getConditions().subscribe({
            next: (conditions) => {
                this.conditions = conditions;
            },
            error: (error => {
                this.router.navigate(['/']);
            })
        });
    }
}
