import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { Creature } from '../../../entities/Creature';
import { DamageIconComponent } from '../../icons/damage-icon/damage-icon.component';
import { EditIconComponent } from '../../icons/edit-icon/edit-icon.component';
import { UpIconComponent } from '../../icons/up-icon/up-icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteIconComponent } from '../../icons/delete-icon/delete-icon.component';

@Component({
    selector: 'app-creature',
    imports: [
        DamageIconComponent,
        EditIconComponent,
        UpIconComponent,
        ReactiveFormsModule,
        FormsModule,
        DeleteIconComponent
    ],
    templateUrl: './creature.component.html'
})
export class CreatureComponent {
    readonly creature: InputSignal<Creature|undefined> = input();
    readonly showDetails: InputSignal<boolean> = input(false);
    readonly showActions: InputSignal<boolean> = input(false);

    editMode: boolean = false;

    @Output() killCreatureEvent = new EventEmitter();
    @Output() updateCreatureEvent = new EventEmitter();
    @Output() deleteCreatureEvent = new EventEmitter();

    killCreature() {
        this.killCreatureEvent.emit();
    }

    setEditMode(): void {
        this.editMode = true;
    }

    updateCreature(): void {
        this.updateCreatureEvent.emit(this.creature);
    }

    deleteCreature(): void {
        this.deleteCreatureEvent.emit(this.creature);
    }
}
