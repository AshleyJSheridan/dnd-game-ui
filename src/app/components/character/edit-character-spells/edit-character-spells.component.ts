import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { Character } from '../../../entities/Character';
import { AvailableSpells } from '../../../entities/AvailableSpells';
import { Spell } from '../../../entities/Spell';
import { SpellSchoolIconComponent } from '../../icons/spell-school-icon/spell-school-icon.component';
import { SpellComponentIconComponent } from '../../icons/spell-component-icon/spell-component-icon.component';
import {EditCharacterSpellComponent} from '../edit-character-spell/edit-character-spell.component';

@Component({
    selector: 'app-edit-character-spells',
    imports: [
        SpellSchoolIconComponent,
        SpellComponentIconComponent,
        EditCharacterSpellComponent
    ],
    templateUrl: './edit-character-spells.component.html'
})
export class EditCharacterSpellsComponent {
    availableSpells: AvailableSpells | undefined;
    character: Character | undefined;
    spellLevels = Array(10).fill(0).map((x,i) => i);
    selectedSpells = Array(10).fill(undefined).map(() => []);
    learnedSpellIds: Array<number> = [];
    otherKnownSpellIds: Array<number> = [];

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getAvailableSpells().subscribe((spells) => {
            this.availableSpells = spells;
        });

        this.characterService.getCharacter().subscribe((character) => {
            this.character = character;

            character.magic.learned_spells.forEach(spell => {
                this.learnedSpellIds.push(spell.id);
            })
            character.magic.other_known_spells.forEach(spell => {
                this.otherKnownSpellIds.push(spell.id);
            })
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

    public isSpellSelected(spell: Spell): boolean {
        // @ts-ignore
        return this.selectedSpells[spell.level].includes(spell.id);
    }

    public selectSpell(spell: Spell): void {
        if (this.isSpellSelected(spell)) {
            this.selectedSpells[spell.level] = this.selectedSpells[spell.level].filter(el => el !== spell.id);
            return;
        }

        // @ts-ignore
        if (this.selectedSpells[spell.level].length < this.availableSpells[`level_${spell.level}`]) {
            // @ts-ignore
            this.selectedSpells[spell.level].push(spell.id);
        }
    }
}
