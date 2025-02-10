import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CharacterService } from '../../../services/character.service';

@Component({
    selector: 'app-create-nav',
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './create-nav.component.html'
})
export class CreateNavComponent {
    charGuid: string = '';

    constructor(private characterService: CharacterService) {}

    ngOnInit() {
        this.charGuid = this.characterService.getCharGuid();
    }
}
