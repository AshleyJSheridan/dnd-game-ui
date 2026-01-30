import { Component, inject } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from '../../../entities/Character';
import { AbilityScoreComponent } from './ability-score/ability-score.component';
import { HeaderSlimComponent } from "../../header/header-slim/header-slim.component";
import { Language } from '../../../entities/Language';
import { LanguageScriptComponent } from '../../icons/language-script/language-script.component';
import { MoneyComponent } from '../money/money.component';
import { InventoryListComponent } from '../inventory-list/inventory-list.component';
import { Spell } from '../../../entities/Spell';
import {EditCharacterSpellComponent} from '../edit-character-spell/edit-character-spell.component';
import {CharacterClassFeature} from '../../../entities/CharacterClassFeature';
import {PortraitComponent} from '../portrait/portrait.component';

@Component({
    selector: 'app-view-character',
    imports: [
        AbilityScoreComponent,
        HeaderSlimComponent,
        LanguageScriptComponent,
        MoneyComponent,
        InventoryListComponent,
        EditCharacterSpellComponent,
        PortraitComponent
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
    selectedTab: string = 'abilities';
    readonly spellLevels: number[] = Array(10).fill(0).map((x,i) => i);

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

    getCharacterLanguages(): Array<Language> {
        return (this.character?.languages.known ?? [])
            .concat(this.character?.languages.racial ?? [])
            .concat(this.character?.languages.class ?? [])
            .filter((lang, index, self) => self.findIndex(l => l.name === lang.name) === index);
    }

    // Tabbed interface
    selectTab(tabName: string): void {
        this.selectedTab = tabName;
    }

    getCharacterSpells(): Array<Spell> {
        return (this.character?.magic.learned_spells ?? [])
            .concat(this.character?.magic.other_known_spells ?? [])
            .filter((spell, index, self) => self.findIndex(s => s.name === spell.name) === index);
    }

    getSpellsAtLevel(level: number): Array<Spell> {
        return this.getCharacterSpells().filter(spell => spell.level === level);
    }

    getCharacterClassAbilities(): Array<CharacterClassFeature> {
        return (this.character?.class_features ?? [])
            .concat(this.character?.selected_class_path.features ?? [])
            .filter((feature, index, self) => self.findIndex(l => l.name === feature.name) === index)
            .sort((a, b) => a.level - b.level);
    }
}
