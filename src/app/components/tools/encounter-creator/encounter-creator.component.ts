import {Component, ViewChild} from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CampaignService } from '../../../services/campaign-service';
import { Campaign } from '../../../entities/Campaign';
import { EncounterService } from '../../../services/encounter-service';
import { Encounter } from '../../../entities/Encounter';
import { CreatureComponent } from '../../creatures/creature/creature.component';
import { DatePipe } from '@angular/common';
import { Creature } from '../../../entities/Creature';
import { DeleteIconComponent } from '../../icons/delete-icon/delete-icon.component';
import { MonsterIconComponent } from '../../icons/monster-icon/monster-icon.component';
import { LightboxComponent } from '../../dialogs/lightbox/lightbox.component';
import { EditIconComponent } from '../../icons/edit-icon/edit-icon.component';

@Component({
    selector: 'app-encounter-creator',
    imports: [
        HeaderComponent,
        FormsModule,
        ReactiveFormsModule,
        CreatureComponent,
        DatePipe,
        DeleteIconComponent,
        MonsterIconComponent,
        LightboxComponent,
        EditIconComponent
    ],
    templateUrl: './encounter-creator.component.html',
})
export class EncounterCreatorComponent {
    public campaigns: Array<Campaign> = [];
    public environments: string[] = [
        'arctic',
        'coast',
        'desert',
        'forest',
        'grassland',
        'hill',
        'mountain',
        'swamp',
        'underdark',
        'underwater',
        'urban',
    ];
    public environment: string = 'forest';
    public characterLevels: string = '';
    public selectedCampaignId: string = '';
    public difficulties = [
        {id: 1, name: 'easy'},
        {id: 2, name: 'medium'},
        {id: 3, name: 'hard'},
        {id: 4, name: 'deadly'},
    ];
    public difficulty: number = 2;
    public encounters: Array<Encounter> = [];
    public addCreatureErrorMessage: string = '';
    public creatures: Array<Creature> = [];
    public creatureType: string = '-';
    public creatureSearch: string = '';
    public selectedEncounterGuid: string = '';
    public editingEncounterGuid: string = '';

    @ViewChild('addCreatureLightbox') addCreatureLightbox: LightboxComponent | undefined;

    constructor(private campaignService: CampaignService, private encounterService: EncounterService) {
        this.campaignService.getOwnCampaigns().subscribe({
            next: (campaigns) => {
                this.campaigns = campaigns;
            },
            error: (error) => {

            }
        });

        this.encounterService.getExistingEncounters().subscribe({
            next: (encounters) => {
                this.encounters = encounters;
            },
            error: (error) => {

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

    clearCharLevels(): void {
        this.characterLevels = '';
    }

    clearCampaignSelection(): void {
        this.selectedCampaignId = '';
    }

    submitHandler(event: Event): void {
        this.encounterService.createEncounter(this.environment, this.difficulty, this.selectedCampaignId, this.characterLevels).subscribe({
            next: (encounter) => {
                this.encounters.push(encounter);
            },
            error: (error) => {

            }
        });
    }

    killCreature(encounterGuid: string, creatureGuid: string, creature: Creature): void {
        // set creature hp to 0 and make patch request to update creature in encounter
        creature.hit_points.hp = 0;

        this.encounterService.updateEncounterCreature(encounterGuid, creatureGuid, creature).subscribe({
            next: (encounter) => {
                // Replace this encounter in the encounters array with the updated encounter.
                const encounterIndex = this.encounters.findIndex((e) => e.guid === encounter.guid);
                if (encounterIndex !== -1) {
                    this.encounters[encounterIndex] = encounter;
                }
            },
            error: (error) => {

            }
        });
    }

    updateCreature(encounterGuid: string, creatureGuid: string, creature: Creature): void {
        this.encounterService.updateEncounterCreature(encounterGuid, creatureGuid, creature).subscribe({
            next: (encounter) => {
                // Replace this encounter in the encounters array with the updated encounter.
                const encounterIndex = this.encounters.findIndex((e) => e.guid === encounter.guid);
                if (encounterIndex !== -1) {
                    this.encounters[encounterIndex] = encounter;
                }
            },
            error: (error) => {

            }
        });
    }

    deleteEncounter(encounterGuid: string): void {
        this.encounterService.deleteEncounter(encounterGuid).subscribe({
            next: (response) => {
                // Remove this encounter from the encounters array.
                this.encounters = this.encounters.filter((e) => e.guid !== encounterGuid);
            },
            error: (error) => {

            }
        });
    }

    showEditEncounterName(encounterGuid: string): void {
        this.editingEncounterGuid = encounterGuid;
    }

    updateEncounterName(event: KeyboardEvent | FocusEvent): void {
        // Only trigger the update on blur or enter key.
        if ((event.type === 'keydown' && (event as KeyboardEvent).key === 'Enter') || event.type === 'blur') {
            const encounterName: string = (<HTMLInputElement>event.target).value;

            this.encounterService.updateEncounterName(this.editingEncounterGuid, encounterName).subscribe({
                next: (encounter) => {
                    // Replace this encounter in the encounters array with the updated encounter.
                    const encounterIndex = this.encounters.findIndex((e) => e.guid === encounter.guid);
                    if (encounterIndex !== -1) {
                        this.encounters[encounterIndex] = encounter;
                    }

                    this.editingEncounterGuid = '';
                },
                error: (error) => {

                }
            });
        }
    }

    deleteCreature(encounterGuid: string, creatureGuid: string): void {
        this.encounterService.deleteCreature(encounterGuid, creatureGuid).subscribe({
            next: (response) => {
                // Remove this creature from the encounter's creatures array.
                const encounterIndex = this.encounters.findIndex((e) => e.guid === encounterGuid);
                if (encounterIndex !== -1) {
                    const encounter = this.encounters[encounterIndex];
                    encounter.creatures = encounter.creatures.filter((c) => c.guid !== creatureGuid);
                }
            },
            error: (error) => {

            }
        });
    }

    showAddCreatureLightbox(encounterGuid: string): void {
        if (!this.creatures.length) {
            this.campaignService.getCreatures().subscribe({
                next: (creatures) => {
                    this.creatures = creatures;
                },
                error: (error) => {
                    // TODO handle error loading creatures
                }
            });
        }

        this.selectedEncounterGuid = encounterGuid;
        this.addCreatureLightbox?.showModal(null);
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

    addCreatureToEncounter(creature: Creature): void {
        // add creature to encounter with a post request, then update encounter in encounters array with the response
        this.encounterService.addCreatureToEncounter(this.selectedEncounterGuid, creature.id).subscribe({
            next: (encounter) => {
                // Replace this encounter in the encounters array with the updated encounter.
                const encounterIndex = this.encounters.findIndex((e) => e.guid === encounter.guid);
                if (encounterIndex !== -1) {
                    this.encounters[encounterIndex] = encounter;
                }
            },
            error: (error) => {

            }
        });

        this.addCreatureLightbox?.cancelModal();
    }
}
