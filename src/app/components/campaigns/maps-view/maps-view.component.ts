import { Component, inject,  signal, WritableSignal } from '@angular/core';
import { HeaderSlimComponent } from '../../header/header-slim/header-slim.component';
import { CampaignService } from '../../../services/campaign-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignMap } from '../../../entities/CampaignMap';
import { MapActionIconComponent } from '../../icons/map-action-icon/map-action-icon.component';
import { FormsModule } from '@angular/forms';
import { Campaign } from '../../../entities/Campaign';
import { PortraitComponent } from '../../character/portrait/portrait.component';
import { Character } from '../../../entities/Character';
import { MovementObject } from '../../../entities/MovementObject';
import { Creature } from '../../../entities/Creature';
import { CreatureComponent } from '../../creatures/creature/creature.component';
import {CampaignMapPlayer} from '../../../entities/CampaignMapPlayer';
import {CampaignMapCreature} from '../../../entities/CampaignMapCreature';
import {MapPatternComponent} from '../../map-pattern/map-pattern.component';

@Component({
    selector: 'app-maps-view',
    imports: [
        HeaderSlimComponent,
        MapActionIconComponent,
        FormsModule,
        PortraitComponent,
        CreatureComponent,
        MapPatternComponent
    ],
    templateUrl: './maps-view.component.html'
})
export class MapsViewComponent {
    private readonly route = inject(ActivatedRoute);
    campaignMap: CampaignMap = new CampaignMap();
    campaign: Campaign | undefined = undefined;
    mapMode: string = '';
    // this is needed, because a colour input apparently cannot be bound in the same way a checkbox can in angular
    gridColour: WritableSignal<string> = signal('#ffffff');
    showSettings: boolean = false;
    error: string = '';
    movementObject: MovementObject = new MovementObject();
    creatures: Array<Creature> = [];
    creatureType: string = '-';
    creatureSearch: string = '';

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

        if (mode === 'Creature') {
            this.campaignService.getCreatures().subscribe({
                next: (creatures) => {
                    this.creatures = creatures;
                },
                error: (error) => {
                    // TODO handle error
                }
            })
        }
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

    addCreatureToMap(creature: Creature): void {
        const x = this.getViewBoxWidth() / 2;
        const y = this.getViewBoxHeight() / 2;

        this.campaignService.addCreatureToMap('creature', this.campaignMap.guid, x, y, creature.id).subscribe({
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

    // recursively get the entity SVG element from the target, as event target might be nested element
    getMapSVGEntity(target: SVGElement): SVGElement | undefined {
        if ((target).tagName === 'svg')
            return undefined;

        if (
            (target).getAttribute('class') === 'character' ||
            (target).getAttribute('class') === 'creature' ||
            (target).getAttribute('class') === 'object'
        )
            return target;

        return this.getMapSVGEntity(target.parentNode as SVGElement);
    }

    getCurrentSelectedObject(): CampaignMapPlayer | CampaignMapCreature | undefined {
        if (this.movementObject.entityType === 'character') {
            return this.campaignMap.players.find(c => c.guid === this.movementObject.entityGuid);
        } else if (this.movementObject.entityType === 'creature') {
            return this.campaignMap.creatures.find(c => c.guid === this.movementObject.entityGuid);
        }

        return undefined;
    }

    mapMouseDownHandler(event: MouseEvent): void {
        // ignore anything except left mouse button
        if(event.button > 0)
            return;

        if (this.mapMode === 'Pointer') {
            const mapEntity = this.getMapSVGEntity(event.target as SVGElement);

            if (mapEntity !== undefined) {
                this.movementObject.inMotion = true;
                this.movementObject.target = mapEntity;
                this.movementObject.entityGuid = mapEntity.getAttribute('data-guid') ?? '';
                this.movementObject.entityType = mapEntity.getAttribute('class') ?? '';
                this.movementObject.elementStartX = parseInt(mapEntity.getAttribute('data-x') ?? '0');
                this.movementObject.elementStartY = parseInt(mapEntity.getAttribute('data-y') ?? '0');
                this.movementObject.startX = event.offsetX;
                this.movementObject.startY = event.offsetY;
            }
        }
    }

    mapMouseUpHandler(event: MouseEvent): void {
        if (this.mapMode === 'Pointer' && this.movementObject.inMotion) {
            this.movementObject.inMotion = false;

            this.movementObject.endX = event.offsetX;
            this.movementObject.endY = event.offsetY;

            const dx = event.offsetX - this.movementObject.startX;
            const dy = event.offsetY - this.movementObject.startY;

            // no point making a request to backend for what is effectively no movement
            if (Math.abs(dx) < 5 || Math.abs(dy) < 5)
                return;

            const updateData = {
                guid: this.movementObject.entityGuid,
                type: this.movementObject.entityType,
                x: this.movementObject.elementStartX + dx,
                y: this.movementObject.elementStartY + dy,

            };
            const target = this.movementObject.target;
            const elementStartX = this.movementObject.elementStartX;
            const elementStartY = this.movementObject.elementStartY;
            this.campaignService.updateMapEntity(this.campaignMap.guid, this.movementObject.entityGuid, updateData).subscribe({
                next: (map) => {
                    this.campaignMap = map;
                },
                error: (error) => {
                    // @ts-ignore
                    this.moveSvgElement(target, elementStartX, elementStartY);
                }
            })
        }
    }

    mapMouseMoveHandler(event: MouseEvent): void {
        if (this.mapMode === 'Pointer' && this.movementObject.inMotion) {
            const dx = event.offsetX - this.movementObject.startX;
            const dy = event.offsetY - this.movementObject.startY;

            // @ts-ignore
            this.moveSvgElement(this.movementObject.target, dx, dy);
        }
    }

    moveSvgElement(element: SVGElement, dx: number, dy: number): void {
        // @ts-ignore
        element.transform.baseVal.getItem(0).setTranslate(this.movementObject.elementStartX + dx, this.movementObject.elementStartY + dy);
    }

    getFilteredCreatures(): Array<Creature> {
        if (this.creatureSearch !== '' && this.creatureSearch.length > 1) {
            return this.creatures.filter((creature) => {
                // force a case-insensitive search
                return creature.name.toLowerCase().includes(this.creatureSearch.toLowerCase());
            });
        }

        if (this.creatureType === '-')
            return [];

        return this.creatures.filter((creature) => {
            return creature.type === this.creatureType;
        });
    }

    clearCreatureType(event: KeyboardEvent): void {
        // only clear the select list if we're typing into the text box
        if ((event.currentTarget as HTMLInputElement).value !== '') {
            this.creatureType = '-';
        }
    }

    clearCreatureSearch(event: Event): void {
        if ((event.currentTarget as HTMLInputElement).value !== '-') {
            this.creatureSearch = '';
        }
    }

    saveRingColour(event: Event): void {
        const newRingColor = (event.currentTarget as HTMLInputElement).value;

        const updateData = {
            guid: this.movementObject.entityGuid,
            type: this.movementObject.entityType,
            highlight_colour: newRingColor,
        };

        this.campaignService.updateMapEntity(this.campaignMap.guid, this.movementObject.entityGuid, updateData).subscribe({
            next: (map) => {
                this.campaignMap = map;
            },
            error: (error) => {

            }
        })
    }

    saveEntityName(event: Event): void {
        const entityName = (event.currentTarget as HTMLInputElement).value;

        const updateData = {
            guid: this.movementObject.entityGuid,
            type: this.movementObject.entityType,
            entity_name: entityName,
        };

        this.campaignService.updateMapEntity(this.campaignMap.guid, this.movementObject.entityGuid, updateData).subscribe({
            next: (map) => {
                this.campaignMap = map;
            },
            error: (error) => {

            }
        })
    }
}
