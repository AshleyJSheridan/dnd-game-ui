import {Component, inject,  signal, WritableSignal} from '@angular/core';
import { HeaderSlimComponent } from '../../header/header-slim/header-slim.component';
import { CampaignService } from '../../../services/campaign-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignMap } from '../../../entities/CampaignMap';
import { MapActionIconComponent } from '../../icons/map-action-icon/map-action-icon.component';
import { FormsModule } from '@angular/forms';
import { Campaign } from '../../../entities/Campaign';
import { PortraitComponent } from '../../character/portrait/portrait.component';
import { Character } from '../../../entities/Character';
import { MoveObject } from '../../../entities/MoveObject';

@Component({
    selector: 'app-maps-view',
    imports: [
        HeaderSlimComponent,
        MapActionIconComponent,
        FormsModule,
        PortraitComponent
    ],
    templateUrl: './maps-view.component.html'
})
export class MapsViewComponent {
    private readonly route = inject(ActivatedRoute);
    campaignMap: CampaignMap = new CampaignMap();
    campaign: Campaign | undefined = undefined;
    mapMode: string = 'Pointer';
    // this is needed, because a colour input apparently cannot be bound in the same way a checkbox can in angular
    gridColour: WritableSignal<string> = signal('#ffffff');
    showSettings: boolean = false;
    error: string = '';
    moveObject: MoveObject = new MoveObject();

    constructor(private campaignService: CampaignService, private router: Router) {}

    ngOnInit(): void {
        const campaignGuid = this.route.snapshot.paramMap.get('guid') ?? '';
        const mapGuid = this.route.snapshot.paramMap.get('mapGuid') ?? '';
        this.campaignService.setCampaignGuid(campaignGuid);

        this.campaignService.getMap(mapGuid).subscribe(
            {
                next: (map) => {
                    this.campaignMap = map;

                    this.gridColour.set(map.grid_colour);
                },
                error: (error => {
                    //this.router.navigate(['/']);
                })
            }
        );

        this.campaignService.getCampaign(campaignGuid).subscribe(
            {
                next: (campaign) => {
                    this.campaign = campaign;
                },
                error: (error => {
                    //this.router.navigate(['/']);
                })
            }
        );
    }

    getImageUrl(): string {
        return `${this.campaignService.apiUrl}/campaigns/maps/${this.campaignMap?.guid}/image`;
    }

    setMapMode(mode: string): void {
        this.showSettings = true;
        this.mapMode = mode;
    }

    getViewBoxWidth(): number {
        return Math.ceil((this.campaignMap?.width ?? 1) / this.campaignMap.grid_size) * this.campaignMap.grid_size;
    }

    getViewBoxHeight(): number {
        return Math.ceil((this.campaignMap?.height ?? 1) / this.campaignMap.grid_size) * this.campaignMap.grid_size;
    }

    changeGridSize(size: number): void {
        if (this.campaignMap.grid_size + size === 0 || !this.campaignMap)
            return;

        this.updateMap({grid_size: this.campaignMap.grid_size + size});

        this.campaignMap.grid_size += size;
    }

    saveGridColour(): void {
        this.updateMap({grid_colour: this.gridColour()});
    }

    toggleGrid(): void {
        this.updateMap({show_grid: this.campaignMap.show_grid});
    }

    private updateMap(data: object): void {
        console.log(data);
        this.campaignService.updateMap(this.campaignMap?.guid, data).subscribe({
            next: (map) => {
                this.campaignMap = map;
            },
            error: (error) => {
                this.error = 'There was an error updating the map';
            }
        });
    }

    hideSettings(): void {
        this.showSettings = false;
    }

    addCharacterToMap(character: Character): void {
        const x = this.getViewBoxWidth() / 2;
        const y = this.getViewBoxHeight() / 2;

        this.campaignService.addCreatureToMap('character', this.campaignMap.guid, x, y, character.guid).subscribe({
            next: (map: CampaignMap) => {
                this.campaignMap = map;
            },
            error: (e) => {
                // TODO handle error adding entity to map
            }
        })
    }

    selectTab(event: MouseEvent): void {
        const tabButton = <HTMLElement>event.currentTarget;

        if (tabButton.getAttribute('aria-selected') === 'true')
            return;

        // set all tabs to inactive, then re-activate current active one
        // @ts-ignore
        tabButton.parentNode.querySelectorAll('[role="tab"]').forEach((tab) => {
            tab.setAttribute('aria-selected', 'false');
        });
        tabButton.setAttribute('aria-selected', 'true');

        // @ts-ignore
        tabButton.parentNode.parentNode.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
            panel.setAttribute('hidden', 'true');
        });
        // @ts-ignore
        tabButton.parentNode.parentNode.querySelector('#' + tabButton.getAttribute('aria-controls')).removeAttribute('hidden');
    }

    getCharacterImageUrl(custom_portrait: string, guid: string): string {
        if (custom_portrait)
            return `${this.campaignService.apiUrl}/characters/${guid}/portrait`;
        else
            return 'images/silhouette.png';
    }

    mapMouseDownHandler(event: MouseEvent): void {
        if (this.mapMode === 'Pointer') {
            if ((event.target as SVGElement).getAttribute('class') === 'player') {
                this.moveObject.target = event.target as SVGElement;
                this.moveObject.startX = event.offsetX;
                this.moveObject.startY = event.offsetY;
                // @ts-ignore
                this.moveObject.startCx = parseInt((event.target as SVGElement).getAttribute('cx'));
                // @ts-ignore
                this.moveObject.startCy = parseInt((event.target as SVGElement).getAttribute('cy'));
            }
        }
    }

    mapMouseUpHandler(event: MouseEvent): void {
        if (this.mapMode === 'Pointer' && this.moveObject.target) {
            this.moveObject.endX = event.offsetX;
            this.moveObject.endY = event.offsetY;

            const dx = event.offsetX - this.moveObject.startX;
            const dy = event.offsetY - this.moveObject.startY;
            this.moveObject.target.setAttribute('cx', String(this.moveObject.startCx + dx));
            this.moveObject.target.setAttribute('cy', String(this.moveObject.startCy + dy));

            this.moveObject.target = null;
        }
    }

    mapMouseMoveHandler(event: MouseEvent): void {
        if (this.mapMode === 'Pointer' && this.moveObject.target) {
            const dx = event.offsetX - this.moveObject.startX;
            const dy = event.offsetY - this.moveObject.startY;

            this.moveObject.target.setAttribute('cx', String(this.moveObject.startCx + dx));
            this.moveObject.target.setAttribute('cy', String(this.moveObject.startCy + dy));
        }
    }
}
