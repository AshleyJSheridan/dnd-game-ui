import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { Character } from '../../../entities/Character';
import { AvailableSpells } from '../../../entities/AvailableSpells';
import { Spell } from '../../../entities/Spell';
import { EditCharacterSpellComponent } from '../edit-character-spell/edit-character-spell.component';

@Component({
    selector: 'app-edit-character-spells',
    imports: [
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
    selectedSpellCountError: boolean = false;

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getAvailableSpells().subscribe((spells) => {
            this.availableSpells = spells;
        });

        this.characterService.getCharacter().subscribe((character) => {
            this.character = character;

            character.magic.learned_spells.forEach(spell => {
                this.learnedSpellIds.push(spell.id);
                // @ts-ignore
                this.selectedSpells[spell.level].push(spell.id);
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

    public isSpellSelected(spell: Spell): boolean {
        // @ts-ignore
        return this.selectedSpells[spell.level].includes(spell.id);
    }

    public selectSpell(spell: Spell): void {
        this.selectedSpellCountError = false;

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

    public getSelectedAtLevelCount(level: number): number {
        return this.selectedSpells[level].length;
    }

    public getKnownSpells(): Array<Spell> {
        return this.character?.magic.other_known_spells ?? [];
    }

    public setSpells(): void {
        this.selectedSpellCountError = false;

        for (let i = 0; i < 10; i ++) {
            // @ts-ignore
            if (this.selectedSpells[i].length !== this.availableSpells[`level_${i}`]) {
                this.selectedSpellCountError = true;
                break;
            }
        }

        if (!this.selectedSpellCountError) {
            this.characterService.setSpells(this.selectedSpells.flat()).subscribe(character => {
                this.router.navigate([`/characters/${character.guid}/edit/equipment`]);
            });
        }
    }
}
