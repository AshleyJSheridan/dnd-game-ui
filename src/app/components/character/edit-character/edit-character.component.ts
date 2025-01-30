import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { CreateNavComponent } from '../create-nav/create-nav.component';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../../services/character.service';
import {CharacterEditRedirectService} from '../../../services/character-edit-redirect.service';

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
    private readonly route = inject(ActivatedRoute);

    constructor(private characterService: CharacterService,
        private characterEditRedirectService: CharacterEditRedirectService) {}

    ngOnInit(): void {
        const charGuid = this.route.snapshot.paramMap.get('guid') ?? '';
        this.characterService.setCharGuid(charGuid);

        this.characterEditRedirectService.redirectToCorrectEditLocation();
    }
}
