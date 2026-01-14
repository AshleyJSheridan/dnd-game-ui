import { Component, EventEmitter, input, Output } from '@angular/core';
import { CampaignMapCreature } from '../../../entities/CampaignMapCreature';
import { DiceComponent } from '../../dice/dice.component';

@Component({
  selector: 'app-map-creature-details',
    imports: [
        DiceComponent
    ],
  templateUrl: './map-creature-details.component.html',
  styleUrl: './map-creature-details.component.scss'
})
export class MapCreatureDetailsComponent {
    creature = input<CampaignMapCreature | undefined>(undefined);

    @Output() diceRoll = new EventEmitter();

    getCreatureSpeeds(): string {
        if (!this.creature() || !this.creature()?.entity)
            return '';

        const speeds = this.creature()?.entity?.speed;
        if (!speeds)
            return '';

        const speedsArray = Object.entries(speeds);
        return speedsArray.map(speed => `${speed[0]}: ${speed[1]}`).join(', ');
    }

    showRoll(rollData: {value: number}, modifier: number): void {
        this.diceRoll.emit({roll: rollData.value, modifier: modifier});
    }

    showSkillRoll(rollData: {value: number}, skill: string): void {
        // should always be true as this is triggered from a button that's only shown for known skills.
        const hasProficiency = Object.keys(this.creature()!.entity!.skill_modifiers).includes(skill);
        const proficiencyBonus = this.getBonusForChallengeRating(this.creature()!.entity!.challenge_rating);
        const skillModifier = this.getSkillBonus(skill);

        this.diceRoll.emit({roll: rollData.value, modifier: (skillModifier + (hasProficiency ? proficiencyBonus : 0))});
    }

    getSkillBonus(skill: string): number {
        if (skill === 'Acrobatics' || skill === 'Sleight of Hand' || skill === 'Stealth')
            return this.creature()?.entity?.abilities.dex.modifier ?? 0;

        if (skill === 'Animal Handling' || skill === 'Insight' || skill === 'Medicine' || skill === 'Perception' || skill === 'Survival')
            return this.creature()?.entity?.abilities.wis.modifier ?? 0;

        if (skill === 'Arcana' || skill === 'History' || skill === 'Investigation' || skill === 'Nature' || skill === 'Religion')
            return this.creature()?.entity?.abilities.int.modifier ?? 0;

        if (skill === 'Athletics')
            return this.creature()?.entity?.abilities.str.modifier ?? 0;

        if (skill === 'Deception' || skill === 'Intimidation' || skill === 'Performance' || skill === 'Persuasion')
            return this.creature()?.entity?.abilities.cha.modifier ?? 0;

        return 0;
    }

    getBonusForChallengeRating(rating: number): number {
        if (rating >= 0 && rating <= 4)
            return 2;
        else if (rating >= 5 && rating <= 8)
            return 3;
        else if (rating >= 9 && rating <= 12)
            return 4;
        else if (rating >= 13 && rating <= 16)
            return 5;
        else if (rating >= 17 && rating <= 20)
            return 6;
        else if (rating >= 21 && rating <= 24)
            return 7;
        else if (rating >= 25 && rating <= 28)
            return 8;
        else if (rating >= 29)
            return 9;

        return 0;
    }

    creatureHasResistances(): boolean {
        if (!this.creature()?.entity?.resistances)
            return false;

        // @ts-ignore
        const resistances = Object.keys(this.creature()?.entity?.resistances);

        if (!resistances || resistances.length === 0)
            return false;

        return true;
    }

    creatureHasSenses(): boolean {
        const senses = this.creature()?.entity?.senses;

        return (
            (senses?.Blindsight ?? 0) +
            (senses?.Darkvision ?? 0) +
            (senses?.Tremorsense ?? 0) +
            (senses?.Truesight ?? 0)
        ) > 0;
    }

    creatureHasLanguages(): boolean {
        return (this.creature()?.entity?.languages.length ?? 0) > 0;
    }

    creatureHasSkillProficiencies(): boolean {
        return (Object.keys(this.creature()?.entity?.skill_modifiers ?? {}).length > 0);
    }

    creatureHasSavingThrows(): boolean {
        return (Object.keys(this.creature()?.entity?.saving_throws ?? {}).length > 0);
    }
}
