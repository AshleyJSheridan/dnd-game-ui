import { Component } from '@angular/core';
import {Item} from '../../../entities/Item';
import {LibraryService} from '../../../services/library.service';
import {Router, RouterLink} from '@angular/router';
import {HeaderComponent} from '../../header/header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GameItemComponent} from '../../game-item/game-item.component';
import {PaginationComponent} from '../../pagination/pagination.component';
import {PaginationConfig} from '../../../entities/PaginationConfig';

@Component({
    selector: 'app-library-items',
    imports: [
        HeaderComponent,
        FormsModule,
        ReactiveFormsModule,
        GameItemComponent,
        PaginationComponent,
        RouterLink
    ],
    templateUrl: './library-items.component.html',
})
export class LibraryItemsComponent {
    public items: Array<Item> = [];
    public paginationConfig: PaginationConfig = new PaginationConfig(1, 24, 0);
    public itemType: string = '';
    public itemRarity: string = '';
    public itemName: string = '';
    readonly rarities: string[] = [
        'common',
        'uncommon',
        'rare',
        'very rare',
    ];
    readonly itemTypes: string[] = [
        'armor',
        'art object',
        'artisan',
        'bag',
        'book',
        'clothing',
        'food',
        'gaming',
        'gemstone',
        'instrument',
        'other',
        'pack',
        'potion',
        'projectile',
        'weapon',
    ];

    constructor(private libraryService: LibraryService, private router: Router) {
        this.libraryService.getItems().subscribe({
            next: (items) => {
                this.items = items;
                this.paginationConfig.totalItems = items.length;
            },
            error: (error => {
                this.router.navigate(['/']);
            })
        });
    }

    public getFilteredItems(): Array<Item> {
        const start = (this.paginationConfig.currentPage - 1) * this.paginationConfig.perPage;
        const end = start + this.paginationConfig.perPage;

        const items = this.items?.filter(item => {
            const itemTypeMatch = this.itemType === '' || this.itemType === item.type;
            const itemRarityMatch = this.itemRarity === '' || this.itemRarity === item.rarity;
            const itemNameMatch = this.itemName === '' || item.name.toLowerCase().includes(this.itemName.toLowerCase());

            return itemTypeMatch && itemRarityMatch && itemNameMatch;
        });

        this.paginationConfig.totalItems = items.length;

        return items.slice(start, end);
    }
}
