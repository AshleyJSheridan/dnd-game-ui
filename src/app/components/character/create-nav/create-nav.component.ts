import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CharacterService } from '../../../services/character.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-create-nav',
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './create-nav.component.html'
})
export class CreateNavComponent {
    //private readonly route = inject(ActivatedRoute);

    charGuid: string = '';

    constructor(public characterService: CharacterService, private location: Location) {}

    ngOnInit() {
        this.charGuid = this.characterService.getCharGuid();
    }

    // unfortunately, ActivatedRoute is all kinds of broken when working with child components, so this is the workaround
    isLinkActive(path: string): boolean {
        return this.location.path().includes(`edit/${path}`);
    }
}
