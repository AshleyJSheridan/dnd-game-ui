import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { Spell } from '../../../entities/Spell';
import { EditCharacterSpellComponent } from '../../character/edit-character-spell/edit-character-spell.component';
import { Router } from '@angular/router';
import { LibraryService } from '../../../services/library.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-library-spells-list',
    imports: [
        HeaderComponent,
        EditCharacterSpellComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './library-spells-list.component.html',
})
export class LibrarySpellsListComponent {
    public spells: Spell[] = [];
    public spellLevels = Array(10).fill(0).map((x,i) => i);
    public spellSchools: Array<string> = [
        'Abjuration',
        'Conjuration',
        'Divination',
        'Enchantment',
        'Evocation',
        'Illusion',
        'Necromancy',
        'Transmutation'
    ];
    public selectedSchool: string = '';
    public characterClasses: Array<string> = [
        'Bard',
        'Cleric',
        'Druid',
        'Paladin',
        'Priest',
        'Ranger',
        'Sorcerer',
        'Warlock',
        'Wizard',
    ];
    public selectedClass: string = '';
    public selectedSpellLevel: number = -1;

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getAllSpells().subscribe(
            {
                next: (spells) => {
                    this.spells = spells;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    public getAvailableSpellsByLevel(level: number): Array<Spell> {
        return this.spells?.filter((spell) => {
            const levelMatch = spell.level === level;
            const schoolMatch = this.selectedSchool === '' || this.selectedSchool === spell.school.name;
            const classMatch = this.selectedClass === '' || spell.classes.includes(this.selectedClass);
            // this one is different as it is set by the filter form.
            const selectedLevelMatch = this.selectedSpellLevel === -1 || spell.level == this.selectedSpellLevel;

            return levelMatch && schoolMatch && classMatch && selectedLevelMatch;
        }) ?? [];
    }
}
