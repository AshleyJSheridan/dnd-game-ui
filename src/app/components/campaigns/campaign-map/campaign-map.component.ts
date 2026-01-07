import { Component, inject, signal, ViewChild, WritableSignal, AfterViewInit, ChangeDetectorRef, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { HeaderSlimComponent } from '../../header/header-slim/header-slim.component';
import { CampaignService } from '../../../services/campaign-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignMap } from '../../../entities/CampaignMap';
import { MapActionIconComponent } from '../../icons/map-action-icon/map-action-icon.component';
import { FormsModule } from '@angular/forms';
import { Campaign } from '../../../entities/Campaign';
import { PortraitComponent } from '../../character/portrait/portrait.component';
import { Character } from '../../../entities/Character';
import { Creature } from '../../../entities/Creature';
import { CreatureComponent } from '../../creatures/creature/creature.component';
import { CampaignMapPlayer } from '../../../entities/CampaignMapPlayer';
import { CampaignMapCreature } from '../../../entities/CampaignMapCreature';
import { MapPatternComponent } from '../map-pattern/map-pattern.component';
import { CampaignMapDrawing } from '../../../entities/CampaignMapDrawing';
import { DamageIconComponent } from '../../icons/damage-icon/damage-icon.component';
import { DrawingObject } from '../../../entities/DrawingObject';
import { CallbackLightboxComponent } from '../../dialogs/callback-lightbox/callback-lightbox.component';
import { SvgDragDropEvent, SvgDraggableDirective } from '../../../directives/svg-draggable.directive';
import { DeleteIconComponent } from '../../icons/delete-icon/delete-icon.component';

@Component({
    selector: 'app-campaign-map',
    imports: [
        HeaderSlimComponent,
        MapActionIconComponent,
        FormsModule,
        MapPatternComponent,
        CreatureComponent,
        PortraitComponent,
        SvgDraggableDirective,
        DamageIconComponent,
        DeleteIconComponent,
    ],
    templateUrl: './campaign-map.component.html'
})
export class CampaignMapComponent implements AfterViewInit {
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
    selectedEntity: CampaignMapCreature | CampaignMapPlayer | CampaignMapDrawing | null = null;

    drawing: DrawingObject = new DrawingObject();
    damageTypeIcons: Array<string> = ['Bludgeoning', 'Piercing', 'Slashing', 'Acid', 'Cold', 'Fire', 'Force', 'Lightning',
        'Necrotic', 'Poison', 'Psychic', 'Radiant', 'None'];

    readonly entityLabelPadding = 10;
    labelWidths = new Map<string, number>();

    @ViewChild('settingsLightbox') settingsLightbox: CallbackLightboxComponent | undefined;
    @ViewChildren('entityLabel') entityLabels!: QueryList<ElementRef<SVGTextElement>>;

    constructor(private campaignService: CampaignService, private router: Router, private cdr: ChangeDetectorRef) {}

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

    ngAfterViewInit(): void {
        // Re-measure whenever the entity
        this.entityLabels.changes.subscribe(() => this.measureEntityLabels());

        // Initial measurement
        this.measureEntityLabels();
    }

    private measureEntityLabels(): void {
        // Wait until the DOM is updated for this change-detection tick
        queueMicrotask(() => {
            const next = new Map<string, number>();

            for (const ref of this.entityLabels.toArray()) {
                const el = ref.nativeElement;
                const guid = el.getAttribute('data-guid');
                if (!guid) continue;

                let width = this.entityLabelPadding;
                try {
                    width = el.getBBox().width + this.entityLabelPadding;
                } catch {
                    // If not in render tree yet, keep fallback
                }

                next.set(guid, width);
            }

            this.labelWidths = next;
            this.cdr.detectChanges(); // avoids ExpressionChangedAfter... and updates rects immediately
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
        if (this.mapMode === 'Pointer') {
            const newX = event.start.x + event.delta.dx;
            const newY = event.start.y + event.delta.dy;
            const updateData = {
                guid: event.id,
                type: entityType,
                x: newX,
                y: newY,

            };

            let entity = null;
            if (entityType === 'creature') {
                entity = this.campaignMap.creatures.find(x => x.guid === event.id);
            }
            if (entityType === 'character') {
                entity = this.campaignMap.players.find(x => x.guid === event.id);
            }
           if (entityType === 'drawing') {
                entity = this.campaignMap.drawings.find(x => x.guid === event.id);
           }

            if (entity) {
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

    getTokenLabelTextWidth(labelId: string): number {
        const padding = 10;
        const labelElement = document.getElementById(labelId) as SVGTextElement | null;

        if (labelElement)
            return labelElement.getBBox().width + padding;

        return padding;
    }

    onSvgPointerDown(event: PointerEvent) {
        if (this.mapMode === 'Draw' || this.mapMode === 'Ruler') {
            event.stopPropagation();

            this.drawing.startX = event.offsetX;
            this.drawing.startY = event.offsetY;
            this.drawing.distance = 0;
            this.drawing.height = 0;
            this.drawing.width = 0;
            this.drawing.angle = 0;

            if (this.mapMode === 'Draw') {
                this.drawing.drawing = true;
            }

            if (this.mapMode === 'Ruler') {
                this.drawing.isRuler = true;
                this.drawing.endX = event.offsetX;
                this.drawing.endY = event.offsetY;
            }

        }

        if (this.mapMode === 'Pointer') {
            const mapEntity = this.getMapSVGEntity(event.target as SVGElement);

            if (mapEntity) {
                // Get the selected object from it's type and guid.
                const entityType = mapEntity.getAttribute('data-type') ?? '';
                const entityGuid = mapEntity.getAttribute('data-guid') ?? '';

                if (entityType !== '' && entityGuid !== '') {
                    const entity = this.getEntityByTypeAndGuid(entityType, entityGuid);

                    if (entity) {
                        this.selectedEntity = entity;
                    }
                }
            }
        }
    }

    onSvgPointerMove(event: PointerEvent) {
        if (this.mapMode === 'Draw' || this.mapMode === 'Ruler') {
            event.stopPropagation();

            const endX = event.offsetX;
            const endY = event.offsetY;

            if (this.mapMode === 'Draw') {
                this.drawing.distance = Math.sqrt(Math.pow(Math.abs(endX - this.drawing.startX), 2) + Math.pow(Math.abs(endY - this.drawing.startY), 2));
                this.drawing.width = Math.abs(this.drawing.startX - endX);
                this.drawing.height = Math.abs(this.drawing.startY - endY);
                this.drawing.angle = this.getAngleInDegrees(this.drawing.startX, this.drawing.startY, endX, endY);
            }

            if (this.mapMode === 'Ruler') {
                this.drawing.endX = endX;
                this.drawing.endY = endY;
                this.drawing.distance = Math.round(Math.sqrt(Math.pow(Math.abs(this.drawing.endX - this.drawing.startX), 2) + Math.pow(Math.abs(this.drawing.endY - this.drawing.startY), 2)) / this.campaignMap.grid_size * 5);
            }
        }
    }

    onSvgPointerUp(event: PointerEvent) {
        if (this.mapMode === 'Draw') {
            event.stopPropagation();

            this.drawing.drawing = false;

            this.campaignService.addDrawingToMap(this.campaignMap.guid, this.drawing).subscribe({
                next: (map) => {
                    this.campaignMap = map;
                },
                error: (error) => {
                    // TODO handle error
                }
            })

            this.drawing = new DrawingObject();
        }

        if (this.mapMode === 'Ruler') {
            this.drawing = new DrawingObject();
        }
    }

    changeDrawingColour(event: Event): void {
        this.drawing.colour = (event.currentTarget as HTMLInputElement).value;
    }

    private getAngleInDegrees(x1: number, y1: number, x2: number, y2: number): number
    {
        const deltaY = y2 - y1;
        const deltaX = x2 - x1;
        const radians = Math.atan2(deltaY, deltaX);
        return radians * (180 / Math.PI);
    }

    // recursively get the entity SVG element from the target, as event target might be nested element
    getMapSVGEntity(target: SVGElement): SVGElement | undefined {
        if ((target).tagName === 'svg')
            return undefined;

        if (target.hasAttribute('data-type')) {
            const targetType = target.getAttribute('data-type');

            if (
                targetType === 'character' ||
                targetType === 'creature' ||
                targetType === 'object' ||
                targetType === 'drawing'
            )
                return target;
        }

        return this.getMapSVGEntity(target.parentNode as SVGElement);
    }

    getEntityByTypeAndGuid(type: string, guid: string): CampaignMapCreature | CampaignMapPlayer | CampaignMapDrawing | undefined {
        if (type === 'creature') {
            return this.campaignMap.creatures.find(x => x.guid === guid);
        }
        if (type === 'character') {
            return this.campaignMap.players.find(x => x.guid === guid);
        }
        if (type === 'drawing') {
            return this.campaignMap.drawings.find(x => x.guid === guid);
        }

        return undefined;
    }

    changeSelectedEntitySymbol(symbol: string): void {
        if (this.selectedEntity && this.selectedEntity.type === 'drawing') {
            const drawing = this.selectedEntity as CampaignMapDrawing;

            drawing.stats.pattern = symbol;

            const updateData = {
                guid: drawing.guid,
                type: 'drawing',
                stats: {
                    pattern: symbol,
                }
            };

            this.campaignService.updateMapEntity(this.campaignMap.guid, drawing.guid, updateData).subscribe({
                next: (map) => {
                    this.campaignMap = map;
                    this.selectedEntity = null;
                },
                error: (error) => {
                    // TODO handle error updating drawing symbol
                }
            })
        }
    }

    selectedEntitySymbolMatches(symbol: string): boolean {
        if (this.selectedEntity && this.selectedEntity.type === 'drawing') {
            const drawing = this.selectedEntity as CampaignMapDrawing;

            return drawing.stats.pattern === symbol;
        }

        return false;
    }

    changeSelectedEntityColour(event: Event): void {
        if (this.selectedEntity) {
            const colour = (event.currentTarget as HTMLInputElement).value;

            this.selectedEntity.highlight_colour = colour;

            const updateData = {
                guid: this.selectedEntity.guid,
                type: this.selectedEntity.type,
                highlight_colour: colour,
            };

            this.campaignService.updateMapEntity(this.campaignMap.guid, this.selectedEntity.guid, updateData).subscribe({
                next: (map) => {
                    this.campaignMap = map;
                    this.selectedEntity = null;
                },
                error: (error) => {
                    // TODO handle error updating drawing colour
                }
            })
        }
    }

    deleteSelectedEntity(): void {
        if (this.selectedEntity) {
            this.campaignService.removeMapEntity(this.campaignMap.guid, this.selectedEntity.guid).subscribe({
                next: (map) => {
                    this.campaignMap = map;
                    this.selectedEntity = null;
                },
                error: (error) => {
                    // TODO handle error deleting entity
                }
            })
        }
    }
}
