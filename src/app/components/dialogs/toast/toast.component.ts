import { Component } from '@angular/core';

@Component({
    selector: 'app-toast',
    imports: [],
    templateUrl: './toast.component.html'
})
export class ToastComponent {
    canShowToast: boolean = false;

    showToast(): void {
        this.canShowToast = true;

        window.setTimeout(() => {this.canShowToast = false}, 3000);
    }
}
