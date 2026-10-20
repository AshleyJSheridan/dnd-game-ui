import {Component, input, InputSignal, OnDestroy} from '@angular/core';

@Component({
    selector: 'app-toast',
    imports: [],
    templateUrl: './toast.component.html'
})
export class ToastComponent implements OnDestroy {
    messages: {id: number; message: string}[] = [];

    readonly timeout: InputSignal<number> = input(3000);

    private nextId = 0;
    private timers = new Set<number>();

    showToast(message: string): void {
        const id = this.nextId++;
        this.messages = [...this.messages, {id, message}];

        const timer = window.setTimeout(() => {
            this.messages = this.messages.filter(toast => toast.id !== id);
            this.timers.delete(timer);
        }, this.timeout());
        this.timers.add(timer);
    }

    ngOnDestroy(): void {
        this.timers.forEach(timer => window.clearTimeout(timer));
        this.timers.clear();
    }
}
