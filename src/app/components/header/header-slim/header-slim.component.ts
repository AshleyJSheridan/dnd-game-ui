import { Component } from '@angular/core';
import {CharactersNavComponent} from '../../character/characters-nav/characters-nav.component';
import {LogoFullComponent} from '../../logo-full/logo-full.component';

@Component({
    selector: 'app-header-slim',
    imports: [
        CharactersNavComponent,
        LogoFullComponent
    ],
    templateUrl: './header-slim.component.html'
})
export class HeaderSlimComponent {

}
