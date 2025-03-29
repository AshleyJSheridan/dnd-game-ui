import {Component, inject} from '@angular/core';
import {CharacterService} from '../../../services/character.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Character} from '../../../entities/Character';
import {AbilityScoreComponent} from './ability-score/ability-score.component';
import {Skill} from '../../../entities/Skill';
import {LogoFullComponent} from '../../logo-full/logo-full.component';

@Component({
    selector: 'app-view-character',
    imports: [
        AbilityScoreComponent,
        LogoFullComponent,
        RouterLink
    ],
    templateUrl: './view-character.component.html'
})
export class ViewCharacterComponent {
    private readonly route = inject(ActivatedRoute);
    character: Character | undefined;
    readonly abilityNames: Array<string> = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    readonly skillNames: Array<{name: string, ability: string}> = [
        {name: "Acrobatics", ability: "dex"}, {name: "Animal Handing", ability: "wis"}, {name: "Arcana", ability: "int"},
        {name: "Athletics", ability: "str"}, {name: "Deception", ability: "cha"}, {name: "History", ability: "int"},
        {name: "Insight", ability: "wis"}, {name: "Intimidation", ability: "cha"}, {name: "Investigation", ability: "int"},
        {name: "Medicine", ability: "wis"}, {name: "Nature", ability: "int"}, {name: "Perception", ability: "wis"},
        {name: "Persuasion", ability: "cha"}, {name: "Religion", ability: "int"}, {name: "Sleight of Hand", ability: "dex"},
        {name: "Stealth", ability: "dex"}, {name: "Survival", ability: "wis"}
    ];

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

    hasSkillProficiency(skillName: string): boolean
    {
        const matchedSkill = this.character?.skills.known.filter(skill => {
            return skill.name === skillName;
        });

        return !!(matchedSkill && matchedSkill.length > 0);
    }

    getSkillProficiencyBonus(skill: {name: string, ability: string}): number {
        let proficiencyBonus = 0;

        if (this.hasSkillProficiency(skill.name)) {
            proficiencyBonus = this.character?.proficiency_bonus ?? 0;
        }

        return this.getAbilitySavingThrow(skill.ability) + proficiencyBonus;
    }
}
