import {Component, input, InputSignal} from '@angular/core';
import {Item} from '../../../entities/Item';

@Component({
    selector: 'app-toast',
    imports: [],
    templateUrl: './toast.component.html'
})
export class ToastComponent {
    canShowToast: boolean = false;
    message: string = '';

    readonly timeout: InputSignal<number> = input(3000);

    showToast(message: string): void {
        this.message = message;
        this.canShowToast = true;

        window.setTimeout(() => {this.canShowToast = false}, this.timeout());
    }
}
