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
}
