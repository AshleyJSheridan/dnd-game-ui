import { Component } from '@angular/core';
import {CharactersNavComponent} from '../character/characters-nav/characters-nav.component';
import {LogoFullComponent} from '../logo-full/logo-full.component';

@Component({
  selector: 'app-header',
    imports: [
        CharactersNavComponent,
        LogoFullComponent
    ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

}
