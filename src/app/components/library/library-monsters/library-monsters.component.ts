import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Creature } from '../../../entities/Creature';
import { Router } from '@angular/router';
import { LibraryService } from '../../../services/library.service';
import { PaginationConfig } from '../../../entities/PaginationConfig';
import { PaginationComponent } from '../../pagination/pagination.component';
import { CreatureComponent } from '../../creatures/creature/creature.component';
import { LightboxComponent } from '../../dialogs/lightbox/lightbox.component';
import { CreatureDetailsComponent } from '../../creatures/creature-details/creature-details.component';

@Component({
    selector: 'app-library-monsters',
    imports: [
        HeaderComponent,
        FormsModule,
        ReactiveFormsModule,
        PaginationComponent,
        CreatureComponent,
        LightboxComponent,
        CreatureDetailsComponent,
    ],
    templateUrl: './library-monsters.component.html',
})
export class LibraryMonstersComponent {
    public monsters: Array<Creature> = [];
    public paginationConfig: PaginationConfig = new PaginationConfig(1, 24, 0);
    public selectedCreature: Creature | null = null;
    public selectedCreatureType: string  = '';
    public creatureTypes: Array<string> = [
        'Aberration',
        'Beast',
        'Celestial',
        'Construct',
        'Dragon',
        'Elemental',
        'Fey',
        'Fiend',
        'Giant',
        'Humanoid',
        'Monstrosity',
        'Ooze',
        'Plant',
        'Undead',
    ];
    public selectedEnvironment: string = '';
    public environments: Array<string> = [
        'Arctic',
        'Coast',
        'Desert',
        'Forest',
        'Grassland',
        'Hill',
        'Mountain',
        'Swamp',
        'Underdark',
        'Underwater',
        'Urban',
    ];
    public selectedSize: string = '';
    public sizes: Array<string> = [
        'Tiny',
        'Small',
        'Medium',
        'Large',
        'Huge',
        'Gargantuan',
    ];
    public creatureName: string = '';

    @ViewChild('creatureDetailsLightbox') creatureDetailsLightbox: LightboxComponent | undefined;

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getAllMonsters().subscribe(
            {
                next: (monsters) => {
                    this.monsters = monsters;
                    this.paginationConfig.totalItems = monsters.length;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    public getFilteredMonsters(): Array<Creature> {
        const start = (this.paginationConfig.currentPage - 1) * this.paginationConfig.perPage;
        const end = start + this.paginationConfig.perPage;

        const monsters = this.monsters?.filter(monster => {
            const typeMatch = this.selectedCreatureType === '' || this.selectedCreatureType.toLowerCase() === monster.type;
            const environmentMatch = this.selectedEnvironment === '' || monster.environments.includes(this.selectedEnvironment.toLowerCase());
            const sizeMatch = this.selectedSize === '' || this.selectedSize.toLowerCase() === monster.size;
            const nameMatch = this.creatureName === '' || monster.name.toLowerCase().includes(this.creatureName.toLowerCase());

            return typeMatch && environmentMatch && sizeMatch && nameMatch;
        }) ?? [];

        this.paginationConfig.totalItems = monsters.length;
        return monsters.slice(start, end);
    }

    public showCreatureDetails(creature: Creature) {
        this.selectedCreature = creature;
        this.creatureDetailsLightbox!.showModal(null);
    }
}
