import {Component, input, InputSignal} from '@angular/core';

@Component({
    selector: 'app-skill-icon',
    imports: [],
    templateUrl: './skill-icon.component.html'
})
export class SkillIconComponent {
    readonly skillName: InputSignal<string> = input<string>('');
}
