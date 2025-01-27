import {Component, HostListener, input, InputSignal, ViewChild} from '@angular/core';

@Component({
    selector: 'app-confirm',
    imports: [],
    templateUrl: './confirm.component.html'
})
export class ConfirmComponent {
    heading: InputSignal<string> = input('');
    cancelLabel: InputSignal<string> = input('Cancel');
    confirmLabel: InputSignal<string> = input('Confirm');

    canShowModal: boolean = false;
    focusReturnElement: EventTarget|null = null;

    @ViewChild('firstFocus') firstFocus: any;
    @ViewChild('lastFocus') lastFocus: any;

    @HostListener('document:keydown', ['$event'])
    handleEscapeEvent(event: KeyboardEvent): void {
        // only take action if the modal is actually being shown
        if (this.canShowModal) {
            if(event.key === 'Escape') {
                this.cancelModal();
            }

            if(event.key === 'Tab') {
                this.handleTabEvent(event);
            }
        }
    }

    handleTabEvent(event: KeyboardEvent): void {
        if (event.target === this.lastFocus.nativeElement && event.shiftKey === false) {
            event.preventDefault();
            this.firstFocus.nativeElement.focus();
        }

        if (event.target === this.firstFocus.nativeElement && event.shiftKey === true) {
            event.preventDefault();
            this.lastFocus.nativeElement.focus();
        }
    }

    showModal(focusReturnElement: EventTarget): void {
        this.focusReturnElement = focusReturnElement;
        this.canShowModal = true;

        window.setTimeout(() => {this.firstFocus.nativeElement.focus()}, 10);
    }

    cancelModal(): void {
        this.canShowModal = false;

        window.setTimeout(() => {
            console.log(<HTMLElement>this.focusReturnElement);
            (<HTMLElement>this.focusReturnElement).focus();
        }, 10);
    }
}
