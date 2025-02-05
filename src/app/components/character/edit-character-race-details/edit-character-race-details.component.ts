import {Component, input, InputSignal} from '@angular/core';
import {CharacterRace} from '../../../entities/CharacterRace';

@Component({
      selector: 'app-edit-character-race-details',
      imports: [],
      templateUrl: './edit-character-race-details.component.html'
})
export class EditCharacterRaceDetailsComponent {
    race: InputSignal<CharacterRace | undefined> = input();
}
