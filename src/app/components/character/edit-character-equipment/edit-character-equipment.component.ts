import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { Item } from '../../../entities/Item';
import {StartingEquipment} from '../../../entities/StartingEquipment';
import {GameItemComponent} from '../../game-item/game-item.component';

@Component({
    selector: 'app-edit-character-equipment',
    imports: [
        GameItemComponent
    ],
    templateUrl: './edit-character-equipment.component.html'
})
export class EditCharacterEquipmentComponent {
    startingEquipment: Array<StartingEquipment> = [];

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharClassStartingEquipment().subscribe({
            next: (equipment) => {
                this.startingEquipment = equipment;
            },
            error: (error) => {

            }
        });
    }
}
