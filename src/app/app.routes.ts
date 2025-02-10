import { provideRouter, Routes} from '@angular/router';
import { CreateComponent } from './components/character/create/create.component';
import { CharactersListComponent } from './components/character/characters-list/characters-list.component';
import { ViewCharacterComponent } from './components/character/view-character/view-character.component';
import { EditCharacterClassComponent } from './components/character/edit-character-class/edit-character-class.component';
import { EditCharacterComponent } from './components/character/edit-character/edit-character.component';
import { EditCharacterBackgroundComponent } from './components/character/edit-character-background/edit-character-background.component';
import { EditCharacterRaceComponent } from './components/character/edit-character-race/edit-character-race.component';
import { ApplicationConfig } from "@angular/core";
import { EditCharacterAbilitiesComponent } from './components/character/edit-character-abilities/edit-character-abilities.component';
import { EditCharacterLanguagesComponent } from './components/character/edit-character-languages/edit-character-languages.component';

export const routes: Routes = [
    { path: 'char-create', component: CreateComponent },
    { path: 'characters', component: CharactersListComponent },
    { path: 'characters/:guid', component: ViewCharacterComponent },
    {
        path: 'characters/:guid/edit',
        component: EditCharacterComponent,
        children: [
            { path: 'class', component: EditCharacterClassComponent },
            { path: 'background', component: EditCharacterBackgroundComponent },
            { path: 'race', component: EditCharacterRaceComponent },
            { path: 'abilities', component: EditCharacterAbilitiesComponent },
            { path: 'languages', component: EditCharacterLanguagesComponent }
        ]
    }
];

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes)
    ],
};
