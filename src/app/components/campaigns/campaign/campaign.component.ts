import {Component, inject, ViewChild} from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { Campaign } from '../../../entities/Campaign';
import { CampaignService } from '../../../services/campaign-service';
import { ActivatedRoute, Router } from '@angular/router';
import {MapPreviewComponent} from '../map-preview/map-preview.component';
import {CopyIconComponent} from '../../icons/copy-icon/copy-icon.component';
import {ClipboardService} from '../../../services/clipboard-service';
import {ConfirmComponent} from '../../dialogs/confirm/confirm.component';
import {ToastComponent} from '../../dialogs/toast/toast.component';

@Component({
    selector: 'app-campaign',
    imports: [
        HeaderComponent,
        MapPreviewComponent,
        CopyIconComponent,
        ToastComponent
    ],
    templateUrl: './campaign.component.html'
})
export class CampaignComponent {
    private readonly route = inject(ActivatedRoute);
    campaign: Campaign | undefined = undefined;
    showAddMapForm: boolean = false;
    fileName: string = '';
    file: File | undefined;
    fileError: string = '';

    @ViewChild('name') mapName: any;
    @ViewChild('description') mapDescription: any;
    @ViewChild('toastComponent') toast: ToastComponent | undefined;

    constructor(private campaignService: CampaignService, private router: Router, private clipboardService: ClipboardService) {}

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
}
