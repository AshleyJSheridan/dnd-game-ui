import { Component, inject, ViewChild } from '@angular/core';
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
import { EditCharacterSpellComponent } from '../edit-character-spell/edit-character-spell.component';
import { CharacterClassFeature } from '../../../entities/CharacterClassFeature';
import { PortraitComponent } from '../portrait/portrait.component';
import { FormsModule } from '@angular/forms';
import { RolledDiceComponent } from '../../dice/rolled-dice/rolled-dice.component';
import { ToastComponent } from '../../dialogs/toast/toast.component';
import { Item } from '../../../entities/Item';
import { Money } from '../../../entities/Money';
import { LightboxComponent } from '../../dialogs/lightbox/lightbox.component';
import {GameItemComponent} from '../../game-item/game-item.component';

@Component({
    selector: 'app-view-character',
    imports: [
        AbilityScoreComponent,
        HeaderSlimComponent,
        LanguageScriptComponent,
        MoneyComponent,
        InventoryListComponent,
        EditCharacterSpellComponent,
        PortraitComponent,
        FormsModule,
        RolledDiceComponent,
        ToastComponent,
        LightboxComponent,
        GameItemComponent,
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
    editMode = {
        hitPoints: false,
        hitPointsModifier: false,
    };
    public diceRollResult: string = '';
    public selectedItem: Item | null = null;

    @ViewChild('d20') d20!: RolledDiceComponent | undefined;
    @ViewChild('d20ResultToast') d20ResultToast!: ToastComponent | undefined;
    @ViewChild('selectedItemLightbox') selectedItemLightbox!: LightboxComponent | undefined;

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

        return abilities ? abilities[0] : {name: '', base: 0, modifier: 0, description: ''};
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

    rollAbility(roll: {modifier: number, ability: string}): void {
        const diceRoll = Math.floor(Math.random() * 20) + 1;

        if (this.d20) {
            this.d20.roll(diceRoll);
        }

        this.diceRollResult = `${roll.ability}: ${diceRoll} + ${roll.modifier} = ${diceRoll + roll.modifier}`;
        console.log(this.diceRollResult);
        this.d20ResultToast?.showToast();
    }

    /*rollAttack(event: {type?: string, subType?: string, finesse?: boolean, proficiencyType?: string}): void {
        const diceRoll = Math.floor(Math.random() * 20) + 1;
        const highestDexOrStrBonus = this.getAbilityDetails('dex').modifier > this.getAbilityDetails('str').modifier
            ? this.getAbilityDetails('dex').modifier
            : this.getAbilityDetails('str').modifier;
        const highestDesOrStrShortname = this.getAbilityDetails('dex').modifier > this.getAbilityDetails('str').modifier ? 'dex' : 'str';
        const modifier = (event.finesse ?? false) ? highestDexOrStrBonus : this.getAbilityDetails('str').modifier;
        let proficiencyBonus = 0;
        let isProficient = false;

        if (
            this.character
            && this.character.proficiencies!.weapons?.find(prof => prof.name === event.proficiencyType)
        ) {
            proficiencyBonus = (this.character?.proficiency_bonus ?? 0)
            isProficient = true;
        }

        if (this.d20) {
            this.d20.roll(diceRoll);
        }

        if (isProficient) {
            this.diceRollResult = `Attack Roll: ${diceRoll} + ${modifier} (${highestDesOrStrShortname}) + ${proficiencyBonus} (proficient) = ${diceRoll + modifier + proficiencyBonus}`;
        } else {
            this.diceRollResult = `Attack Roll: ${diceRoll} + ${modifier} (${highestDesOrStrShortname}) = ${diceRoll + modifier}`;
        }
        console.log(this.diceRollResult);

        this.d20ResultToast?.showToast();
    }*/

    openItemDetails(item: Item): void {
        this.selectedItem = item;
        this.selectedItemLightbox?.showModal(null);
    }

    isRollable(item: Item): boolean {
        return item.proficiency !== null
            && (item.proficiency!.type.includes('Melee') || item.proficiency!.type.includes('Ranged'));
    }

    performItemAction(action: string): void {
        if (!this.selectedItem)
            return;

        if (!this.isRollable(this.selectedItem))
            return;

        let diceRoll = 0;
        const finesse = this.selectedItem.weapon_props?.finesse ?? false;
        let selectedAbilityShortName = 'str';
        let actualModifier = this.getAbilityDetails('str').modifier;

        if (this.selectedItem.proficiency!.type.includes('Ranged')) {
            actualModifier = this.getAbilityDetails('dex').modifier;
            selectedAbilityShortName = 'dex';
        } else if (finesse) {
            actualModifier = this.getAbilityDetails('dex').modifier > this.getAbilityDetails('str').modifier
                ? this.getAbilityDetails('dex').modifier
                : this.getAbilityDetails('str').modifier;;
            selectedAbilityShortName = this.getAbilityDetails('dex').modifier > this.getAbilityDetails('str').modifier ? 'dex' : 'str';
        }

        if (action === 'rollAttack') {
            diceRoll = Math.floor(Math.random() * 20) + 1;
            let proficiencyBonus = 0;
            let isProficient = false;

            if (
                this.character
                && this.character.proficiencies!.weapons?.find(prof => prof.name === (this?.selectedItem?.proficiency?.name ?? ''))
            ) {
                proficiencyBonus = (this.character?.proficiency_bonus ?? 0)
                isProficient = true;
            }

            if (isProficient) {
                this.diceRollResult = `Attack Roll: ${diceRoll} + ${actualModifier} (${selectedAbilityShortName}) + ${proficiencyBonus} (proficient) = ${diceRoll + actualModifier + proficiencyBonus}`;
            } else {
                this.diceRollResult = `Attack Roll: ${diceRoll} + ${actualModifier} (${selectedAbilityShortName}) = ${diceRoll + actualModifier}`;
            }

            // These rolls are always d20
            if (this.d20) {
                this.d20.roll(diceRoll);
            }
        }

        if (action === 'rollDamage') {
            // TODO parse the damange amount string to handle multiple dice and modifiers, for now just display the damage roll with the ability modifier.
            const parsedDice = this.parseDiceString(this.selectedItem.weapon_props!.damage.amount);
            

            this.diceRollResult = `Damage Roll: ${this.selectedItem.weapon_props?.damage.amount} + ${actualModifier} (${selectedAbilityShortName}) = ${this.selectedItem.weapon_props?.damage.amount} + ${actualModifier}`;
        }

        // Show the results
        console.log(this.diceRollResult);
        this.d20ResultToast?.showToast();
    }

    parseDiceString(diceString: string): {numDice: number, dieType: number, modifier: number} {
        const diceRegex = /(\d*)d(\d+)([+-]\d+)?/;
        const match = diceString.match(diceRegex);

        if (!match) {
            throw new Error(`Invalid dice string: ${diceString}`);
        }

        const numDice = match[1] ? parseInt(match[1], 10) : 1;
        const dieType = parseInt(match[2], 10);
        const modifier = match[3] ? parseInt(match[3], 10) : 0;

        return { numDice, dieType, modifier };
    }

    // Methods for updating the character stats.
    updateChar(event: FocusEvent): void {
        type EditModeKey = keyof typeof this.editMode;

        for (const editModeKey in this.editMode) {

            const keyStr = editModeKey as EditModeKey;

            this.editMode[keyStr as EditModeKey] = false;
        }

        this.applyUpdateAndRefreshCharacter((event.target as HTMLInputElement).name, parseInt((event.target as HTMLInputElement).value, 10));
    }

    updateAbilityScore(ability: {name: string, value: number}): void {
        if (!this.character) return;

        const abilityToUpdate = this.character.abilities.find(a => a.short_name === ability.name);

        if (abilityToUpdate) {
            abilityToUpdate.base = ability.value;

            this.applyUpdateAndRefreshCharacter(ability.name, ability.value);
        }
    }

    updateMoney(money: Money): void {
        this.characterService.updateCharacterProperty('money', money).subscribe(
            {
                next: (character) => {
                    this.character = character;
                },
                error: (error => {

                })
            }
        );
    }

    applyUpdateAndRefreshCharacter(property: string, value: any): void {
        this.characterService.updateCharacterProperty(property, value).subscribe(
            {
                next: (character) => {
                    this.character = character;
                },
                error: (error => {

                })
            }
        );
    }

    updateEquippedState(item: Item): void {
        this.characterService.updateCharacterEquippedItem(item.guid, item.equipped ?? false).subscribe(
            {
                next: (character) => {
                    this.character = character;
                },
                error: (error => {

                })
            }
        );
    }

}
