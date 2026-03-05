import { Component, effect, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { Item } from '../../entities/Item';
import { DeleteIconComponent } from '../icons/delete-icon/delete-icon.component';
import { DescriptionIconComponent } from '../icons/description-icon/description-icon.component';
import { EditIconComponent } from '../icons/edit-icon/edit-icon.component';
import { ItemService } from '../../services/item.service';
import { CharacterService } from '../../services/character.service';
import { DownIconComponent } from '../icons/down-icon/down-icon.component';
import { UpIconComponent } from '../icons/up-icon/up-icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddToInventoryIconComponent } from '../icons/add-to-inventory-icon/add-to-inventory-icon.component';
import { ItemTypeIconComponent } from '../icons/item-type-icon/item-type-icon.component';
import {DamageType} from '../../entities/DamageType';

@Component({
    selector: 'app-game-item',
    imports: [
        DeleteIconComponent,
        DescriptionIconComponent,
        EditIconComponent,
        DownIconComponent,
        UpIconComponent,
        FormsModule,
        ReactiveFormsModule,
        AddToInventoryIconComponent,
        ItemTypeIconComponent
    ],
    templateUrl: './game-item.component.html'
})
export class GameItemComponent {
    readonly item: InputSignal<Item|undefined> = input();
    readonly itemLocation: InputSignal<string> = input('inventory');
    readonly openStatus: InputSignal<boolean> = input(false);
    @Output() moveUpdatedItem = new EventEmitter();
    editingName: boolean = false;
    editingDescription: boolean = false;
    editInPlace: boolean = false;
    newName: string = '';
    newDescription: string = '';
    quantityToAdd: number = 1;
    damageTypes: Array<string> = [
        'acid',
        'bludgeoning',
        'cold',
        'fire',
        'force',
        'lightening',
        'necrotic',
        'piercing',
        'poison',
        'psychic',
        'radiant',
        'ranged',
        'slashing',
        'thunder',
    ];
    rarityTypes: Array<string> = [
        'common',
        'uncommon',
        'rare',
        'very rare',
    ];

    constructor(private itemService: ItemService, private characterService: CharacterService) {
        // Force editing back to false if the item is refreshed.
        effect(() => {
            if (this.item()) {
                this.editingName = false;
                this.editingDescription = false;
                this.editInPlace = false;
            }
        });
    }

    getRarityString(): string {
        return this.item()?.rarity ? (this.item()?.rarity as string).replace(' ', '-') : 'Common';
    }

    getItemRangeString(): string {
        if ((this.item()?.weapon_props?.range ?? []).length > 1)
            return this.item()?.weapon_props?.range[0] + '/' + this.item()?.weapon_props?.range[1];

        return '';
    }

    getItemCost(): string {
        if (this.item()?.cost.value) {
            const value = (this.item()?.cost?.value ?? 0) * (this.item()?.quantity ?? 1);

            return `${value} ${this.item()?.cost.unit}`;
        }

        return '';
    }

    getItemWeight(): string {
        if (this.item()?.weight)
            return ((this.item()?.weight ?? 0) * (this.item()?.quantity ?? 1)).toString();

        return '';
    }

    // TODO refactor this as this component should be emitting events rather than alter a characters inventory directly.
    increaseItemStack(): void {
        // @ts-ignore
        const data = {quantity: this.item().quantity + 1};

        // @ts-ignore
        this.itemService.updateItem(this.characterService.getCharGuid(), this.item(), data).subscribe({
            next: (items) => {
                // @ts-ignore
                this.characterService.character.inventory.items = items;
            }
        });
    }

    // TODO refactor this as this component should be emitting events rather than alter a characters inventory directly.
    decreaseItemStack(): void {
        // @ts-ignore
        const data = {quantity: this.item().quantity - 1};

        // @ts-ignore
        this.itemService.updateItem(this.characterService.getCharGuid(), this.item(), data).subscribe({
            next: (items) => {
                // @ts-ignore
                this.characterService.character.inventory.items = items;
            }
        });
    }

    // TODO refactor this as this component should be emitting events rather than alter a characters inventory directly.
    removeItem(): void {
        // @ts-ignore
        this.itemService.removeItem(this.characterService.getCharGuid(), this.item()).subscribe({
            next: (items) => {
                // @ts-ignore
                this.characterService.character.inventory.items = items;
            }
        });
    }

    // TODO refactor this to use the inline method of editing all properties.
    showRenameItemForm(): void {
        this.editingName = true;
        this.newName = this.item()?.name ?? '';
    }

    // TODO refactor this as this component should be emitting events rather than alter a characters inventory directly.
    renameItem(): void {
        const data = {name: this.newName};

        // @ts-ignore
        this.itemService.updateItem(this.characterService.getCharGuid(), this.item(), data).subscribe({
            next: (items) => {
                // @ts-ignore
                this.characterService.character.inventory.items = items;
                this.editingName = false;
            }
        });
    }

    // TODO refactor this to use the inline method of editing all properties.
    showChangeDescriptionForm(): void {
        this.editingDescription = true;
        this.newDescription = this.item()?.description ?? '';
    }

    // TODO refactor this as this component should be emitting events rather than alter a characters inventory directly.
    changeDescription(): void {
        const data = {description: this.newDescription};

        // @ts-ignore
        this.itemService.updateItem(this.characterService.getCharGuid(), this.item(), data).subscribe({
            next: (items) => {
                // @ts-ignore
                this.characterService.character.inventory.items = items;
                this.editingDescription = false;
            }
        });
    }

    // TODO refactor this as this component should be emitting events rather than alter a characters inventory directly.
    addToInventory(): void {
        // @ts-ignore
        this.itemService.addItem(this.characterService.getCharGuid(), this.item(), this.quantityToAdd).subscribe({
            next: (items) => {
                // @ts-ignore
                this.characterService.character.inventory.items = items;
            }
        });
    }

    getDamageList(damageList: Array<DamageType> | undefined): string {
        if (!damageList)
            return '';

        return damageList.map(damage => damage.name).join(', ');
    }

    getClassList(): string {
        return this.item()?.special_properties?.classes?.map(c => c.name).join(', ') ?? '';
    }

    itemHasExtraAbilities(): boolean {
        return !!this.item()?.special_properties?.spells?.length || !!this.item()?.special_properties?.ability;
    }

    editItemInPlace(): void {
        this.editInPlace = true;
    }

    giveToCharacter(): void {
        this.moveUpdatedItem.emit(this.item());
    }
}
