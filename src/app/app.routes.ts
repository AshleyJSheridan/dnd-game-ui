import { Routes } from '@angular/router';
import { CreateComponent } from './components/character/create/create.component';
import {CharactersListComponent} from './components/character/characters-list/characters-list.component';

export const routes: Routes = [
  { path: 'char-create', component: CreateComponent },
  { path: 'characters', component: CharactersListComponent}
];
