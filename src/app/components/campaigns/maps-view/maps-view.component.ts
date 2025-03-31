import {Component, inject, signal, WritableSignal} from '@angular/core';
import {HeaderComponent} from '../../header/header.component';
import {HeaderSlimComponent} from '../../header/header-slim/header-slim.component';
import {CampaignService} from '../../../services/campaign-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Campaign} from '../../../entities/Campaign';
import {CampaignMap} from '../../../entities/CampaignMap';
import {MapActionIconComponent} from '../../icons/map-action-icon/map-action-icon.component';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-maps-view',
    imports: [
        HeaderComponent,
        HeaderSlimComponent,
        MapActionIconComponent,
        FormsModule
    ],
    templateUrl: './maps-view.component.html'
})
export class MapsViewComponent {
    private readonly route = inject(ActivatedRoute);
    campaignMap: CampaignMap | undefined = undefined;
    mapMode: string = 'Pointer';
    gridSize: number = 100;
    showGrid: boolean = false;
    gridColour: WritableSignal<string> = signal('#ffffff');
    showSettings: boolean = false;

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
        this.showSettings = true;
        this.mapMode = mode;
    }

    getViewBoxWidth(): number {
        return Math.ceil((this.campaignMap?.width ?? 1) / this.gridSize) * this.gridSize;
    }

    getViewBoxHeight(): number {
        return Math.ceil((this.campaignMap?.height ?? 1) / this.gridSize) * this.gridSize;
    }

    changeGridSize(size: number): void {
        if (this.gridSize + size === 0)
            return;

        // TODO make API call to set grid size for this map
        this.gridSize += size;
    }

    saveGridColour(): void {
        // TODO make API call to set grid size for this map
    }

    hideSettings(): void {
        this.showSettings = false;
    }
}
