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
import {PortraitComponent} from '../../character/portrait/portrait.component';

@Component({
    selector: 'app-campaign',
    imports: [
        HeaderComponent,
        MapPreviewComponent,
        CopyIconComponent,
        ToastComponent,
        PortraitComponent,
    ],
    templateUrl: './campaign.component.html'
})
export class CampaignComponent {
    private readonly route = inject(ActivatedRoute);
    campaign: Campaign | undefined = undefined;
    public characters: Array<Character> = [];
    showAddMapForm: boolean = false;
    fileName: string = '';
    file: File | undefined;
    fileError: string = '';
    editingCampaignName: boolean = false;
    editingCampaignDescription: boolean = false;

    @ViewChild('name') mapName: any;
    @ViewChild('description') mapDescription: any;
    @ViewChild('toastComponent') toast: ToastComponent | undefined;
    @ViewChild('campaignName') campaignName: any | undefined;
    @ViewChild('campaignDescription') campaignDescription: any | undefined;

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
    }

    addMapHandler(): boolean {
        this.fileError = '';

        if (!this.file) {
            this.fileError = 'Please select a file to upload.';
            return false;
        }

        this.campaignService.createMap(
            this.mapName.nativeElement.value,
            this.mapDescription.nativeElement.value,
            this.file
        ).subscribe({
            next: (map) => {
                this.campaign?.maps.push(map);
            },
            error: (error) => {
                this.fileError = 'There was an error uploading the file. Please try again.';
            }
        })

        return false;
    }

    onFileSelected(event: Event): void {
        this.fileError = '';

        // @ts-ignore
        this.file = event.target?.files[0] as File;
        this.fileName = this.file.name;
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
        this.campaignService.updateCampaign(data).subscribe({
            next: (campaign) => {
                this.campaign = campaign;
            },
            error: (error) => {

            }
        })
    }
}
