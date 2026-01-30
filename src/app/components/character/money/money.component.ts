import { Component, input, InputSignal } from '@angular/core';
import { Money } from '../../../entities/Money';
import { CopperComponent } from '../../icons/coins/copper/copper.component';
import { ElectrumComponent } from '../../icons/coins/electrum/electrum.component';
import { GoldComponent } from '../../icons/coins/gold/gold.component';
import { PlatinumComponent } from '../../icons/coins/platinum/platinum.component';
import { SilverComponent } from '../../icons/coins/silver/silver.component';

@Component({
    selector: 'app-money',
    imports: [
        CopperComponent,
        ElectrumComponent,
        GoldComponent,
        PlatinumComponent,
        SilverComponent
    ],
    templateUrl: './money.component.html'
})
export class MoneyComponent {
    readonly money: InputSignal<Money | undefined> = input<Money>();
}
