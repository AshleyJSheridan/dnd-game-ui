import {Component, input, InputSignal} from '@angular/core';
import {Item} from '../../../entities/Item';

@Component({
    selector: 'app-toast',
    imports: [],
    templateUrl: './toast.component.html'
})
export class ToastComponent {
    canShowToast: boolean = false;

    readonly timeout: InputSignal<number> = input(3000);

    showToast(): void {
        this.canShowToast = true;

        window.setTimeout(() => {this.canShowToast = false}, this.timeout());
    }
}
