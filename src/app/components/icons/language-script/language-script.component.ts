import {Component, input, InputSignal} from '@angular/core';

@Component({
    selector: 'app-language-script',
    imports: [],
    templateUrl: './language-script.component.html'
})
export class LanguageScriptComponent {
    readonly scriptName: InputSignal<string> = input<string>('');
}
