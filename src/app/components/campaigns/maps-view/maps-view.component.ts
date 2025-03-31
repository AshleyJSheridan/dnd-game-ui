import {Component, inject} from '@angular/core';
import {HeaderComponent} from '../../header/header.component';
import {HeaderSlimComponent} from '../../header/header-slim/header-slim.component';
import {CampaignService} from '../../../services/campaign-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Campaign} from '../../../entities/Campaign';
import {CampaignMap} from '../../../entities/CampaignMap';
import {MapActionIconComponent} from '../../icons/map-action-icon/map-action-icon.component';

@Component({
    selector: 'app-maps-view',
    imports: [
        HeaderComponent,
        HeaderSlimComponent,
        MapActionIconComponent
    ],
    templateUrl: './maps-view.component.html'
})
export class MapsViewComponent {
    private readonly route = inject(ActivatedRoute);
    campaignMap: CampaignMap | undefined = undefined;
    mapMode: string = 'Pointer';

    constructor(private campaignService: CampaignService, private router: Router) {}

    ngOnInit(): void {
        const campaignGuid = this.route.snapshot.paramMap.get('guid') ?? '';
        const mapGuid = this.route.snapshot.paramMap.get('mapGuid') ?? '';
        this.campaignService.setCampaignGuid(campaignGuid);

        this.campaignService.getMap(mapGuid).subscribe(
            {
                next: (map) => {
                    this.campaignMap = map;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    getImageUrl(): string {
        console.log(`${this.campaignService.apiUrl}/campaigns/maps/${this.campaignMap?.guid}/image`)

        return `${this.campaignService.apiUrl}/campaigns/maps/${this.campaignMap?.guid}/image`;
    }

    setMapMode(mode: string): void {
        this.mapMode = mode;
    }
}
