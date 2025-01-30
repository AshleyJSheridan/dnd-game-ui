import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { CreateNavComponent } from '../create-nav/create-nav.component';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../../services/character.service';

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

    constructor(private characterService: CharacterService) {}


    ngOnInit(): void {
        const charGuid = this.route.snapshot.paramMap.get('guid') ?? '';
        this.characterService.setCharGuid(charGuid);
    }
}
