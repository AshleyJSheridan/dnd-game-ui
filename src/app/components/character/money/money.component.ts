import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { Money } from '../../../entities/Money';
import { CopperComponent } from '../../icons/coins/copper/copper.component';
import { ElectrumComponent } from '../../icons/coins/electrum/electrum.component';
import { GoldComponent } from '../../icons/coins/gold/gold.component';
import { PlatinumComponent } from '../../icons/coins/platinum/platinum.component';
import { SilverComponent } from '../../icons/coins/silver/silver.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-money',
    imports: [
        CopperComponent,
        ElectrumComponent,
        GoldComponent,
        PlatinumComponent,
        SilverComponent,
        FormsModule
    ],
    templateUrl: './money.component.html'
})
export class MoneyComponent {
    public money: InputSignal<Money | undefined> = input<Money>();
    public editMode: boolean = false;

    @Output() updateMoney = new EventEmitter();

    public setMoneyEditMode(): void {
        this.editMode = true;
    }

    public setMoneyValues(): void {
        this.editMode = false;
        this.updateMoney.emit(this.money());
    }
}
