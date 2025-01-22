import { Component } from '@angular/core';
import {CharactersNavComponent} from '../character/characters-nav/characters-nav.component';

@Component({
  selector: 'app-header',
    imports: [
        CharactersNavComponent
    ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

}
