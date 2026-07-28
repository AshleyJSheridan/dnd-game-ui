import { Component, input, InputSignal } from '@angular/core';
import { Creature } from '../../../entities/Creature';
import { CreatureIconComponent } from '../creature-icon/creature-icon.component';

@Component({
    selector: 'app-creature-details',
    imports: [
        CreatureIconComponent
    ],
    templateUrl: './creature-details.component.html',
})
export class CreatureDetailsComponent {
    readonly creature: InputSignal<Creature|undefined> = input();

    getCreatureSpeeds(): string {
        if (!this.creature())
            return '';

        const speeds = this.creature()?.speed;
        if (!speeds)
            return '';

        const speedsArray = Object.entries(speeds);
        return speedsArray.map(speed => `${speed[0]}: ${speed[1]}`).join(', ');
    }

    creatureHasLanguages(): boolean {
        return (this.creature()?.languages.length ?? 0) > 0;
    }

    creatureHasSkillProficiencies(): boolean {
        return (Object.keys(this.creature()?.skill_modifiers ?? {}).length > 0);
    }

    creatureHasSavingThrows(): boolean {
        return (Object.keys(this.creature()?.saving_throws ?? {}).length > 0);
    }

    creatureHasResistances(): boolean {
        if (!this.creature()?.resistances)
            return false;

        // @ts-ignore
        const resistances = Object.keys(this.creature()?.resistances);

        if (!resistances || resistances.length === 0)
            return false;

        return true;
    }

    creatureHasSenses(): boolean {
        const senses = this.creature()?.senses;

        return (
            (senses?.Blindsight ?? 0) +
            (senses?.Darkvision ?? 0) +
            (senses?.Tremorsense ?? 0) +
            (senses?.Truesight ?? 0)
        ) > 0;
    }
}
