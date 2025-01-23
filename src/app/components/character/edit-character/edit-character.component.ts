import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { CreateNavComponent } from '../create-nav/create-nav.component';

@Component({
    selector: 'app-edit-character',
    imports: [
        RouterOutlet,
        HeaderComponent,
        CreateNavComponent
    ],
    templateUrl: './edit-character.component.html'
})
export class EditCharacterComponent {

}
