import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { Router } from '@angular/router';
import { CampaignService } from '../../../services/campaign-service';
import { Campaign, CampaignState } from '../../../entities/Campaign';
import { DatePipe } from '@angular/common';
import { CampaignInvite } from '../../../entities/CampaignInvite';
import { LightboxComponent } from '../../dialogs/lightbox/lightbox.component';
import { Character } from '../../../entities/Character';
import { CharacterService } from '../../../services/character.service';
import { PortraitComponent } from '../../character/portrait/portrait.component';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { CampaignStateComponent } from '../campaign-state/campaign-state.component';

@Component({
    selector: 'app-campaign-list',
    imports: [
        HeaderComponent,
        DatePipe,
        PortraitComponent,
        ConfirmComponent,
        CampaignStateComponent,
    ],
    templateUrl: './campaign-list.component.html'
})
export class CampaignListComponent {
    ownCampaigns: Array<Campaign> = [];
    joinedCampaigns: Array<Campaign> = [];
    invites: Array<CampaignInvite> = [];
    selectedCharactersForInvites: Array<string> = [];
    public characters: Array<Character> = [];
    private activeInvite: CampaignInvite | null = null;

    @ViewChild('acceptInviteLightbox') acceptInviteLightbox: LightboxComponent | undefined;

    constructor(private campaignService: CampaignService, private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.campaignService.getOwnCampaigns().subscribe({
            next: (campaigns) => {
                this.ownCampaigns = campaigns;
            },
            error: (error) => {
                this.router.navigate(['/']);
            }
        });

        this.campaignService.getJoinedCampaigns().subscribe({
            next: (campaigns) => {
                this.joinedCampaigns = campaigns;
            },
            error: (error) => {
                this.router.navigate(['/']);
            }
        });

        this.campaignService.getInvites().subscribe({
            next: (invites) => {
                this.invites = invites;

                this.characterService.getCharacters().subscribe(
                    {
                        next: (characters: Character[]) => {
                            this.characters = characters;
                        },
                        error: (error => {
                            console.log(error)
                        })
                    }
                );
            },
            error: (error) => {
                console.log(error)
            }
        });
    }

    declineInvite(invite: CampaignInvite): void {
        this.campaignService.declineInvite(invite).subscribe({
            next: (invites) => {
                this.invites = invites;
            },
            error: (error) => {
                console.log(error)
            }
        });
    }

    acceptInvite(invite: CampaignInvite, event: MouseEvent): void {
        // show modal with all characters to select one or more to join the campaign with.
        if(event.currentTarget !== null) {
            this.activeInvite = invite;
            this.acceptInviteLightbox?.showModal(event.currentTarget);
        }
    }

    toggleSelectCharacterForInvite(character: Character, event: MouseEvent): void {
        if (this.selectedCharactersForInvites.includes(character.guid)) {
            this.selectedCharactersForInvites = this.selectedCharactersForInvites.filter(guid => guid !== character.guid);
        } else {
            this.selectedCharactersForInvites.push(character.guid);
        }
    }

    isCharacterSelectedForInvite(character: Character): boolean {
        return this.selectedCharactersForInvites.includes(character.guid);
    }

    confirmAcceptInvite(): void {
        if (!this.activeInvite)
            return;

        this.campaignService.acceptInvite(this.activeInvite, this.selectedCharactersForInvites).subscribe({
            next: (campaigns) => {
                this.joinedCampaigns = campaigns;
            },
            error: (error) => {
                console.log(error)
            }
        })
    }
}
