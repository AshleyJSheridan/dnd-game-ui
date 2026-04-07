import { Component, ViewChild } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../entities/Item';
import { GameItemComponent } from '../../game-item/game-item.component';
import { Character } from '../../../entities/Character';
import { CharacterService } from '../../../services/character.service';
import { CampaignService } from '../../../services/campaign-service';
import { Campaign } from '../../../entities/Campaign';
import { LightboxComponent } from '../../dialogs/lightbox/lightbox.component';
import { PortraitComponent } from '../../character/portrait/portrait.component';
import { GiveIconComponent } from '../../icons/give-icon/give-icon.component';
import { ToastComponent } from '../../dialogs/toast/toast.component';

@Component({
    selector: 'app-item-generator',
    imports: [
        HeaderComponent,
        FormsModule,
        GameItemComponent,
        LightboxComponent,
        PortraitComponent,
        GiveIconComponent,
        ToastComponent
    ],
    templateUrl: './item-generator.component.html'
})
export class ItemGeneratorComponent {
    public itemType: string = 'armor';
    readonly itemTypes: string[] = [
        'armor',
        'art object',
        'book',
        'clothing',
        'food',
        'gemstone',
        'other',
        'potion',
        'projectile',
        'weapon',
    ];
    public rarity: string = 'common';
    // TODO eventually add legendary items to this, once they actually get added to the DB.
    readonly rarities: string[] = [
        'common',
        'uncommon',
        'rare',
        'very rare',
    ];
    public item: Item | undefined = undefined;
    public generatedItems: Array<Item> = [];
    public characters: Array<Character> = [];
    public campaigns: Array<Campaign> = [];
    public giveItemErrorMessage: string = '';
    public giveItemSuccessMessage: string = '';

    @ViewChild('giveLightbox') giveLightbox: LightboxComponent | undefined;
    @ViewChild('giveItemSuccessToast') giveItemSuccessToast: ToastComponent | undefined;

    constructor(private itemService: ItemService, private characterService: CharacterService, private campaignService: CampaignService) {
        this.itemService.getGeneratedItems().subscribe({
            next: (generatedItems) => {
                this.generatedItems = generatedItems;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    submitHandler(event: Event): void {
        this.itemService.getItemByTypeAndRarity(this.itemType, this.rarity).subscribe({
            next: (item) => {
                this.item = item;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    saveAndMoveItem(item: Item): void {
        // Get own list of characters, plus own list of campaigns (along with their characters).
        this.characterService.getCharacters().subscribe({
            next: (characters: Character[]) => {
                this.characters = characters;
            },
            error: (error => {

            })
        });
        this.campaignService.getOwnCampaigns().subscribe({
            next: (campaigns) => {
                this.campaigns = campaigns;
            },
            error: (error) => {

            }
        });

        // TODO this should really have a reference to some kind of element to focus back on once the lightbox closes.
        this.giveLightbox?.showModal(null)
    }

    giveItemToCharacter(character: Character): void {
        if (!this.item)
            return;

        this.itemService.addItemToCharInventory(character.guid, this.item).subscribe({
            next: (response) => {
                this.giveLightbox?.cancelModal();
                this.giveItemSuccessMessage = `${this.item?.name} has been given to ${character.name}!`;
                this.giveItemSuccessToast?.showToast();
            },
            error: (error) => {
                switch (error.status) {
                    case HttpStatusCode.Conflict:
                        this.giveItemErrorMessage = error.error.error;
                        break;
                    case HttpStatusCode.NotFound:
                        this.giveItemErrorMessage = error.error.error;
                        break;
                }
            }
        });
    }

    getTotalCampaignsPlayerCount(): number {
        let count = 0;

        this.campaigns.forEach((campaign) => {
            count += campaign.players.length;
        });

        return count;
    }

    selectTab(event: MouseEvent): void {
        const tabButton = <HTMLElement>event.currentTarget;

        if (tabButton.getAttribute('aria-selected') === 'true')
            return;

        // set all tabs to inactive, then re-activate current active one
        tabButton.parentNode!.querySelectorAll('[role="tab"]').forEach((tab) => {
            tab.setAttribute('aria-selected', 'false');
        });
        tabButton.setAttribute('aria-selected', 'true');

        tabButton.parentNode!.parentNode!.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
            panel.setAttribute('hidden', 'true');
        });
        tabButton.parentNode!.parentNode!.querySelector('#' + tabButton.getAttribute('aria-controls'))?.removeAttribute('hidden');
    }
}
