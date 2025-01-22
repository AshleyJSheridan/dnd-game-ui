import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CreateComponent} from './components/character/create/create.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CreateComponent],
  templateUrl: './app.component.html',
  styleUrl: '/src/styles.scss'
})
export class AppComponent {
  title = 'dnd-game-ui';
}
