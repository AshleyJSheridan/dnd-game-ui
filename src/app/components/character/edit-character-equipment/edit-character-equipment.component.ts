import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { StartingEquipment } from '../../../entities/StartingEquipment';
import { GameItemComponent } from '../../game-item/game-item.component';
import { AuthService } from '../../../services/auth.service';
import { Item } from '../../../entities/Item';
import { ItemService } from '../../../services/item.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-character-equipment',
    imports: [
        GameItemComponent,
        FormsModule
    ],
    templateUrl: './edit-character-equipment.component.html'
})
export class EditCharacterEquipmentComponent {
    startingEquipment: Array<StartingEquipment> = [];
    selectedClassSet: number = 0;
    artisansTools: Array<Item> = [];
    instruments: Array<Item> = [];
    selectedInstruments: Array<number> = [];
    selectedTools: Array<number> = [];
    errorMessage: string = '';
    addItems: Array<Item> = [];
    itemTypes: Array<string> = ['armor', 'art object', 'artisan', 'bag', 'book', 'clothing', 'food', 'gaming', 'instrument',
        'gemstone', 'other', 'pack', 'potion', 'projectile', 'weapon'];
    itemTypeFilter: string = '-';
    itemNameFilter: string = '';

    constructor(
        public characterService: CharacterService, private router: Router, private authService: AuthService,
        private itemService: ItemService
    ) {}

    ngOnInit(): void {
        if (!this.characterService.character?.inventory?.items.length) {
            this.characterService.getCharClassStartingEquipment().subscribe({
                next: (equipment) => {
                    this.startingEquipment = equipment;

                    if (this.startingEquipment.filter((set) => {
                        return set.toolsCount > 0;
                    }).length ?? 0) {
                        this.itemService.getItemsByType('artisan').subscribe({
                            next: (tools) => {
                                this.artisansTools = tools;
                            }
                        })
                    }

                    if (this.startingEquipment.filter((set) => {
                        return set.instrumentsCount > 0;
                    }).length ?? 0) {
                        this.itemService.getItemsByType('instrument').subscribe({
                            next: (instruments) => {
                                this.instruments = instruments;
                            }
                        })
                    }
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.refreshToken();
                            break;
                        default:
                            console.error('There was an unexpected error. Please try again later.');
                    }
                }
            });
        }
    }

    selectEquipmentChoice(setId: number): void {
        this.selectedClassSet = setId;
    }

    getToolsTotal(): number {
        return this.startingEquipment.filter((set) => {
            return (set.type === 'background' && set.toolsCount > 0) ||
                (set.type === 'class' && set.id === this.selectedClassSet && set.toolsCount > 0);
        }).length ?? 0;
    }

    getInstrumentsTotal(): number {
        return this.startingEquipment.filter((set) => {
            return (set.type === 'background' && set.instrumentsCount > 0) ||
                (set.type === 'class' && set.id === this.selectedClassSet && set.instrumentsCount > 0);
        }).length ?? 0;
    }

    isInstrumentSelected(instrumentId: number): boolean {
        return this.selectedInstruments.includes(instrumentId);
    }

    isToolsSelected(toolId: number): boolean {
        return this.selectedTools.includes(toolId);
    }

    selectInstrument(instrumentId: number): void {
        if (this.selectedInstruments.includes(instrumentId)) {
            this.selectedInstruments.splice(this.selectedInstruments.indexOf(instrumentId), 1);
            return;
        }

        if (this.selectedInstruments.length < this.getInstrumentsTotal()) {
            this.selectedInstruments.push(instrumentId);
        }
    }

    selectTool(toolId: number): void {
        if (this.selectedTools.includes(toolId)) {
            this.selectedTools.splice(this.selectedTools.indexOf(toolId), 1);
            return;
        }

        if (this.selectedTools.length < this.getInstrumentsTotal()) {
            this.selectedTools.push(toolId);
        }
    }

    setEquipment(): void {
        if (this.selectedInstruments.length< this.getInstrumentsTotal()) {
            this.errorMessage = `You must selected ${this.getInstrumentsTotal()} musical instruments`;
            return;
        }

        if (this.selectedTools.length< this.getToolsTotal()) {
            this.errorMessage = `You must selected ${this.getToolsTotal()} artisan's tools`;
            return;
        }

        const data = {
            selectedClassSet: this.selectedClassSet,
            selectedInstruments: this.selectedInstruments,
            selectedTools: this.selectedTools,
        };

        this.characterService.setCharStartingEquipment(data).subscribe({
            next: (character) => {
                this.characterService.character = character;
            },
            error: (error) => {

            }
        });
    }

    getAddItemsByType(): void {
        this.itemService.getItemsByType(this.itemTypeFilter).subscribe({
            next: (items) => {
                this.addItems = items;
            }
        })
    }

    getFilteredItems(): Array<Item> {
        if (this.itemNameFilter === '')
            return this.addItems;

        return this.addItems.filter((item) => {
            // force a case-insensitive search
            return item.name.toLowerCase().includes(this.itemNameFilter.toLowerCase());
        });
    }
}
