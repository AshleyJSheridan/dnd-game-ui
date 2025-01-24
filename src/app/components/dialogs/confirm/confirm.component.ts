import {Component, input, InputSignal} from '@angular/core';

@Component({
    selector: 'app-confirm',
    imports: [],
    templateUrl: './confirm.component.html'
})
export class ConfirmComponent {
    heading: InputSignal<string> = input('');
    cancelLabel: InputSignal<string> = input('Cancel');
    confirmLabel: InputSignal<string> = input('Confirm');
}
