import { Component, input, InputSignal } from '@angular/core';
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
        AddToInventoryIconComponent
    ],
    templateUrl: './game-item.component.html'
})
export class GameItemComponent {
    readonly item: InputSignal<Item|undefined> = input();
    readonly itemLocation: InputSignal<string> = input('inventory');
    editingName: boolean = false;
    editingDescription: boolean = false;
    newName: string = '';
    newDescription: string = '';
    quantityToAdd: number = 1;

    constructor(private itemService: ItemService, private characterService: CharacterService) {}


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

    removeItem(): void {
        // @ts-ignore
        this.itemService.removeItem(this.characterService.getCharGuid(), this.item()).subscribe({
            next: (items) => {
                // @ts-ignore
                this.characterService.character.inventory.items = items;
            }
        });
    }

    showRenameItemForm(): void {
        this.editingName = true;
        this.newName = this.item()?.name ?? '';
    }

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

    showChangeDescriptionForm(): void {
        this.editingDescription = true;
        this.newDescription = this.item()?.description ?? '';
    }

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

    addToInventory(): void {
        // @ts-ignore
        this.itemService.addItem(this.characterService.getCharGuid(), this.item(), this.quantityToAdd).subscribe({
            next: (items) => {
                // @ts-ignore
                this.characterService.character.inventory.items = items;
            }
        });
    }
}
