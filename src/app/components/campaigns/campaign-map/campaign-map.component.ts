import {Component, inject, signal, ViewChild, WritableSignal} from '@angular/core';
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
import { CampaignMapPlayer } from '../../../entities/CampaignMapPlayer';
import { CampaignMapCreature } from '../../../entities/CampaignMapCreature';
import { MapPatternComponent } from '../map-pattern/map-pattern.component';
import { CampaignMapDrawing } from '../../../entities/CampaignMapDrawing';
import { DamageIconComponent } from '../../icons/damage-icon/damage-icon.component';
import { DrawingObject } from '../../../entities/DrawingObject';
import {CallbackLightboxComponent} from '../../dialogs/callback-lightbox/callback-lightbox.component';
import {SvgDragDropEvent, SvgDraggableDirective} from '../../../directives/svg-draggable.directive';

@Component({
    selector: 'app-campaign-map',
    imports: [
        HeaderSlimComponent,
        MapActionIconComponent,
        CallbackLightboxComponent,
        FormsModule,
        MapPatternComponent,
        CreatureComponent,
        PortraitComponent,
        SvgDraggableDirective
    ],
    templateUrl: './campaign-map.component.html'
})
export class CampaignMapComponent {
    private readonly route = inject(ActivatedRoute);
    campaignMap: CampaignMap = new CampaignMap();
    campaign: Campaign | undefined = undefined;
    error: string = '';
    mapMode: string = ''; // TODO this should be an enum.
    // this is needed, because a colour input apparently cannot be bound in the same way a checkbox can in angular
    gridColour: WritableSignal<string> = signal('#ffffff');
    showSettings: boolean = false;
    creatures: Array<Creature> = [];
    creatureType: string = '-';
    creatureSearch: string = '';

    @ViewChild('settingsLightbox') settingsLightbox: CallbackLightboxComponent | undefined;

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

        this.campaignService.getCreatures().subscribe({
            next: (creatures) => {
                this.creatures = creatures;
            },
            error: (error) => {
                // TODO handle error loading creatures
            }
        });
    }

    setMapMode(mode: string): void {
        this.showSettings = true;
        this.mapMode = mode;


    }

    getImageUrl(): string {
        return `${this.campaignService.apiUrl}/campaigns/maps/${this.campaignMap?.guid}/image`;
    }

    toggleGrid(): void {
        this.updateMap({show_grid: this.campaignMap.show_grid});
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

    getViewBoxWidth(): number {
        return Math.ceil((this.campaignMap?.width ?? 1) / this.campaignMap.grid_size) * this.campaignMap.grid_size;
    }

    getViewBoxHeight(): number {
        return Math.ceil((this.campaignMap?.height ?? 1) / this.campaignMap.grid_size) * this.campaignMap.grid_size;
    }

    updateMapSize(dimension: string, event: Event): void {
        const value = Number((<HTMLInputElement>event.target).value);

        if (dimension === 'width') {
            this.campaignMap.width = value;

            this.updateMap({width: value});
        }

        if (dimension === 'height') {
            this.campaignMap.height = value;

            this.updateMap({height: value});
        }
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

    getCharacterImageUrl(custom_portrait: string, guid: string): string {
        if (custom_portrait)
            return `${this.campaignService.apiUrl}/characters/${guid}/portrait`;
        else
            return 'images/silhouette.png';
    }

    isCharacterInMap(character: Character): boolean {
        const found = this.campaignMap.players.filter((mapCharacter: CampaignMapPlayer) => {
            return mapCharacter.player.guid === character.guid;
        });

        return found.length > 0;
    }

    onTokenDropped(event: SvgDragDropEvent, entityType: string) {
        const newX = event.start.x + event.delta.dx;
        const newY = event.start.y + event.delta.dy;
        const updateData = {
            guid: event.id,
            type: entityType,
            x: newX,
            y: newY,

        };

        let creature = null;
        if (entityType === 'creature') {
            creature = this.campaignMap.creatures.find(x => x.guid === event.id);
        }
        if (entityType === 'character') {
            creature = this.campaignMap.players.find(x => x.guid === event.id);
        }

        if (creature) {
            this.campaignService.updateMapEntity(this.campaignMap.guid, event.id!, updateData).subscribe({
                next: (map) => {
                    this.campaignMap = map;
                },
                error: (error) => {
                    // TODO handle error updating entity position.
                }
            })
        }
    }

    getTokenSizeMultiplier(size: string): number {
        switch (size) {
            case 'tiny':
                return 0.5;
            case 'small':
                return 0.75;
            case 'medium':
                return 1;
            case 'large':
                return 2;
            case 'huge':
                return 3;
            case 'gargantuan':
                return 4;
            default:
                return 1;
        }
    }
}
