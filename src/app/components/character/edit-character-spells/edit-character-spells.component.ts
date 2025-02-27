import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { Character } from '../../../entities/Character';
import { AvailableSpells } from '../../../entities/AvailableSpells';
import { Spell } from '../../../entities/Spell';
import { SpellSchoolIconComponent } from '../../icons/spell-school-icon/spell-school-icon.component';
import { SpellComponentIconComponent } from '../../icons/spell-component-icon/spell-component-icon.component';

@Component({
    selector: 'app-edit-character-spells',
    imports: [
        SpellSchoolIconComponent,
        SpellComponentIconComponent
    ],
    templateUrl: './edit-character-spells.component.html'
})
export class EditCharacterSpellsComponent {
    availableSpells: AvailableSpells | undefined;
    character: Character | undefined;
    spellLevels = Array(10).fill(0).map((x,i) => i);
    selectedSpells = [];

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getAvailableSpells().subscribe((spells) => {
            this.availableSpells = spells;
        });

        this.characterService.getCharacter().subscribe((character) => {
            this.character = character;
        });
    }

    public getSpellCountAvailableForLevel(level: number): number {
        if (!this.availableSpells)
            return 0;

        // @ts-ignore
        return this.availableSpells[`level_${level}`];
    }

    public getAvailableSpellsByLevel(level: number): Array<Spell> {
        return this.availableSpells?.spells.filter((spell) => {
            return spell.level === level;
        }) ?? [];
    }

    public getFormattedRange(range: string): string {
        if (parseInt(range).toString() === range)
            return `${range} ft`;

        return range;
    }

    
}
