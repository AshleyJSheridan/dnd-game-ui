import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import {BookIconComponent} from '../../icons/book-icon/book-icon.component';
import {DiceIconComponent} from '../../icons/dice-icon/dice-icon.component';
import {SwordIconComponent} from '../../icons/sword-icon/sword-icon.component';
import {MonsterIconComponent} from '../../icons/monster-icon/monster-icon.component';

@Component({
    selector: 'app-tools-list',
    imports: [
        HeaderComponent,
        RouterLink,
        BookIconComponent,
        DiceIconComponent,
        SwordIconComponent,
        MonsterIconComponent
    ],
    templateUrl: './tools-list.component.html'
})
export class ToolsListComponent {

}
