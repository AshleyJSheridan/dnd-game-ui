import { Component, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { Campaign } from '../../../entities/Campaign';
import { CampaignService } from '../../../services/campaign-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MapPreviewComponent } from '../map-preview/map-preview.component';
import { CopyIconComponent } from '../../icons/copy-icon/copy-icon.component';
import { ClipboardService } from '../../../services/clipboard-service';
import { ToastComponent } from '../../dialogs/toast/toast.component';
import { CharacterService } from '../../../services/character.service';
import { Character } from '../../../entities/Character';
import { PortraitComponent } from '../../character/portrait/portrait.component';
import { CampaignStateIconComponent } from '../../icons/campaign-state-icon/campaign-state-icon.component';
import { FormsModule } from '@angular/forms';
import { CampaignLore, CampaignLoreType } from '../../../entities/CampaignLore';
import { LoreComponent } from '../lore/lore.component';
import { LightboxComponent } from '../../dialogs/lightbox/lightbox.component';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';

@Component({
    selector: 'app-campaign',
    imports: [
        HeaderComponent,
        MapPreviewComponent,
        CopyIconComponent,
        ToastComponent,
        PortraitComponent,
        CampaignStateIconComponent,
        FormsModule,
        LoreComponent,
        LightboxComponent,
        ConfirmComponent,
    ],
    templateUrl: './campaign.component.html'
})
export class CampaignComponent {
    private readonly route = inject(ActivatedRoute);
    campaign: Campaign | undefined = undefined;
    public characters: Array<Character> = [];
    showAddMapForm: boolean = false;
    showAddLoreForm: boolean = false;
    fileName: string = '';
    loreFileName: string = '';
    file: File | undefined;
    loreItemFile: File | undefined;
    mapFileError: string = '';
    loreFileError: string = '';
    editingCampaignName: boolean = false;
    editingCampaignDescription: boolean = false;
    editingLore: boolean = false;
    loreItemType: string = 'text';
    public loreGroups: Array<string> = [];
    selectedLore: CampaignLore | null = null;
    protected readonly CampaignLoreType = CampaignLoreType;

    @ViewChild('mapName') mapName: any;
    @ViewChild('mapDescription') mapDescription: any;
    @ViewChild('loreItemName') loreItemName: any;
    @ViewChild('loreItemUrl') loreItemUrl: any;
    @ViewChild('loreItemGroup') loreItemGroup: any;
    @ViewChild('loreItemContent') loreItemContent: any;
    @ViewChild('loreItemHideFromPlayers') loreItemHideFromPlayers: any;
    @ViewChild('toastComponent') toast: ToastComponent | undefined;
    @ViewChild('campaignName') campaignName: any | undefined;
    @ViewChild('campaignDescription') campaignDescription: any | undefined;
    @ViewChild('loreLightbox') loreLightbox: LightboxComponent | undefined;
    @ViewChild('confirm') confirm: ConfirmComponent | undefined;
    @ViewChild('editedContent') editedContent: any | undefined;

    constructor(
        private campaignService: CampaignService, private router: Router, private clipboardService: ClipboardService,
        private characterService: CharacterService
    ) {}

    ngOnInit(): void {
        const campaignGuid = this.route.snapshot.paramMap.get('guid') ?? '';
        this.campaignService.setCampaignGuid(campaignGuid);

        this.campaignService.getCampaign(campaignGuid).subscribe(
            {
                next: (campaign) => {
                    this.campaign = campaign;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );

        this.characterService.getCharacters().subscribe(
            {
                next: (characters: Character[]) => {
                    this.characters = characters;
                },
                error: (error => {

                })
            }
        );

        this.campaignService.getCampaignLoreGroups().subscribe(
            {
                next: (loreGroups: string[]) => {
                    this.loreGroups = loreGroups;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    addMapHandler(): boolean {
        this.mapFileError = '';

        if (!this.file) {
            this.mapFileError = 'Please select a file to upload.';
            return false;
        }

        this.campaignService.createMap(
            this.mapName.nativeElement.value,
            this.mapDescription.nativeElement.value,
            this.file
        ).subscribe({
            next: (map) => {
                this.campaign?.maps.push(map);
                this.showAddMapForm = false;
            },
            error: (error) => {
                this.mapFileError = 'There was an error uploading the file. Please try again.';
            }
        });

        return false;
    }

    addLoreHandler(): boolean {
        this.loreFileError = '';

        if (!this.loreItemFile) {
            this.loreFileError = 'Please select a file to upload.';
            return false;
        }

        this.campaignService.createLoreItemForCampaign(
            this.loreItemName.nativeElement.value,
            this.loreItemType,
            this.loreItemUrl.nativeElement.value,
            this.loreItemGroup.nativeElement.value,
            this.loreItemContent.nativeElement.value,
            this.loreItemHideFromPlayers.nativeElement.value,
            this.loreItemFile
        ).subscribe({
            next: (campaignLore) => {
                this.campaign?.lore.push(campaignLore);
                this.showAddLoreForm = false;
            },
            error: (error) => {
                this.mapFileError = 'There was an error creating the lore item. Please try again.';
            }
        });

        return false;
    }

    onFileSelected(event: Event): void {
        this.mapFileError = '';

        // @ts-ignore
        this.file = event.target?.files[0] as File;
        this.fileName = this.file.name;
    }

    onLoreFileSelected(event: Event): void {
        this.loreFileError = '';

        // @ts-ignore
        this.loreItemFile = event.target?.files[0] as File;
        this.loreFileName = this.loreItemFile.name;
    }

    copyCampaignLink(event: MouseEvent): void {
        this.clipboardService.copyTextToClipboard(location.href, <HTMLElement>event.currentTarget);
        this.toast?.showToast();
    }

    addCharacterToCampaign(character: Character): void {
        this.campaignService.addCharacterToCampaign(character.guid).subscribe({
            next: (campaign) => {
                this.campaign = campaign;
            },
            error: (error) => {

            }
        });
    }

    removeCharacterFromCampaign(character: Character): void {
        this.campaignService.removeCharacterFromCampaign(character.guid).subscribe({
            next: (campaign) => {
                this.campaign = campaign;
            },
            error: (error) => {

            }
        });
    }

    isCharacterPartOfCampaign(characterGuid: string): boolean {
        return !!this.campaign?.players.find(p => p.guid === characterGuid);
    }

    doesCharacterBelongToMe(characterGuid: string): boolean {
        return !!this.characters.find(p => p.guid === characterGuid);
    }

    editCampaignName(): void {
        this.editingCampaignName = true;
        window.setTimeout(() => {
            this.campaignName.nativeElement.focus();
        }, 100)
    }

    editCampaignDescription(): void {
        this.editingCampaignDescription = true;
    }

    updateCampaignName(): void {
        this.editingCampaignName = false;

        this.updateCampaign({name: this.campaignName.nativeElement.value})
    }

    updateCampaignDescription(): void {
        this.editingCampaignDescription = false;

        this.updateCampaign({description: this.campaignDescription.nativeElement.value})
    }

    updateCampaign(data: any): void {
        if (!this.campaign)
            return;

        this.campaignService.updateCampaign(data).subscribe({
            next: (campaign) => {
                this.campaign = campaign;
            },
            error: (error) => {

            }
        })
    }

    setCampaignState(state: string): void {
        this.updateCampaign({state: state})
    }

    getLoreGroups(): Array<string> {
        return [...new Set(this.campaign?.lore.map(item => item.lore_group))];
    }

    getLoreByGroup(group: string): Array<CampaignLore> {
        return this.campaign?.lore.filter(item => item.lore_group === group) ?? [];
    }

    loreReadEvent(event: MouseEvent, loreItem: CampaignLore): void {
        this.selectedLore = loreItem;

        if(event.currentTarget !== null) {
            this.loreLightbox?.showModal(event.currentTarget);
        }
    }

    loreDeleteEvent(event: MouseEvent, loreItem: CampaignLore): void {
        this.selectedLore = loreItem;

        if(event.currentTarget !== null) {
            this.confirm?.showModal(event.currentTarget);
        }
    }

    confirmDelete(loreGuid: string | undefined): void {
        this.confirm?.cancelModal();

        if (!loreGuid)
            return;

        this.campaignService.removeCampaignLore(loreGuid).subscribe({
            next: (campaignLore) => {
                this.campaign!.lore = campaignLore;
            },
            error: (error) => {

            }
        });
    }

    editCampaignLore(): void {
        this.editingLore = true;
        window.setTimeout(() => {
            this.editedContent.nativeElement.focus();
        }, 100)
    }

    saveEditedContent(): void {
        this.editingLore = false;

        this.campaignService.updateCampaignLoreContent(this.selectedLore!.guid, this.editedContent.nativeElement.value ).subscribe({
            next: (campaignLore) => {
                this.selectedLore = campaignLore.filter(item => item.guid === this.selectedLore!.guid)[0];

                this.campaign!.lore = campaignLore;
            },
            error: (error) => {

            }
        });
    }
}
