import {Component, inject} from '@angular/core';
import {CharacterService} from '../../../services/character.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Character} from '../../../entities/Character';
import {AbilityScoreComponent} from './ability-score/ability-score.component';

@Component({
    selector: 'app-view-character',
    imports: [
        AbilityScoreComponent
    ],
    templateUrl: './view-character.component.html'
})
export class ViewCharacterComponent {
    private readonly route = inject(ActivatedRoute);
    character: Character | undefined;
    readonly abilityNames: Array<string> = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        const charGuid = this.route.snapshot.paramMap.get('guid') ?? '';
        this.characterService.setCharGuid(charGuid);

        this.characterService.getCharacter().subscribe(
            {
                next: (character) => {
                    this.character = character;
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    getAbilityDetails(abilityShortName: string) {
        const abilities = this.character?.abilities.filter(ability => {
            return ability.short_name === abilityShortName;
        });

        return abilities ? abilities[0] : {name: '', base: 0, modifier: 0};
    }

    hasAbilityProficiency(abilityShortName: string): boolean
    {
        const matchedAbility = this.character?.saving_throws.filter(ability => {
            return ability.short_name === abilityShortName;
        });

        return !!(matchedAbility && matchedAbility.length > 0);
    }

    getAbilitySavingThrow(abilityShortName: string): number
    {
        const abilityDetails = this.getAbilityDetails(abilityShortName);

        if (this.hasAbilityProficiency(abilityShortName))
            return abilityDetails.modifier + (this.character?.proficiency_bonus ?? 0);

        return abilityDetails.modifier;
    }
}
