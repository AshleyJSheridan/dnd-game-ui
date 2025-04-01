import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ClipboardService {
    copyTextToClipboard(text: string, focusTriggerElement: HTMLElement) {
        let textarea = this.createTextarea(text);

        this.addTextareaToPage(textarea, focusTriggerElement);

        textarea.select();
        document.execCommand('copy');

        this.removeTextareaFromPage(textarea, focusTriggerElement);

        // selecting text in this temporary textarea moves focus and leaves it in a weird state, so we have to manually move it back to where it came from
        this.reFocusTriggerElement(focusTriggerElement);
    }

    private createTextarea(text: string): HTMLTextAreaElement {
        let textarea = document.createElement('textarea');
        textarea.setAttribute('aria-hidden','true');
        textarea.setAttribute('class', 'accessible-hidden');
        textarea.value = text;

        return textarea;
    }

    private addTextareaToPage(textarea: HTMLTextAreaElement, focusTriggerElement: HTMLElement): void {
        // @ts-ignore
        focusTriggerElement.parentNode.insertBefore(textarea, focusTriggerElement);
    }

    private removeTextareaFromPage(textarea: HTMLTextAreaElement, focusTriggerElement: HTMLElement): void {
        // @ts-ignore
        focusTriggerElement.parentNode.removeChild(textarea);
    }

    private reFocusTriggerElement(focusTriggerElement: HTMLElement): void {
        focusTriggerElement.focus();
    }
}
