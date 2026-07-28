import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { RouterLink } from '@angular/router';
import { BookIconComponent } from '../../icons/book-icon/book-icon.component';
import { MonsterIconComponent } from '../../icons/monster-icon/monster-icon.component';
import { RaceIconComponent } from '../../icons/race-icon/race-icon.component';
import { ClassIconComponent } from '../../icons/class-icon/class-icon.component';
import { CalendarIconComponent } from '../../icons/calendar-icon/calendar-icon.component';
import { LanguageIconComponent } from '../../icons/language-icon/language-icon.component';
import { ItemTypeIconComponent } from '../../icons/item-type-icon/item-type-icon.component';
import { DeityIconComponent } from '../../icons/deity-icon/deity-icon.component';
import { DamageIconComponent } from '../../icons/damage-icon/damage-icon.component';
import { ConditionsIconComponent } from '../../icons/conditions-icon/conditions-icon.component';

@Component({
    selector: 'app-library',
    imports: [
        HeaderComponent,
        BookIconComponent,
        RouterLink,
        MonsterIconComponent,
        RaceIconComponent,
        ClassIconComponent,
        CalendarIconComponent,
        LanguageIconComponent,
        ItemTypeIconComponent,
        DeityIconComponent,
        DamageIconComponent,
        ConditionsIconComponent
    ],
    templateUrl: './library.component.html'
})
export class LibraryComponent {

}
