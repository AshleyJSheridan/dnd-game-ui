import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { CreatureAlignment } from '../../../entities/CreatureAlignment';

@Component({
    selector: 'app-char-alignment',
    imports: [],
    templateUrl: './char-alignment.component.html'
})
export class CharAlignmentComponent {
    selectedAlignment: number = 0;
    alignments: Array<CreatureAlignment> = [];

    constructor(
        public characterService: CharacterService, private router: Router
    ) {}

    ngOnInit() {
        this.characterService.getAlignments().subscribe({
            next: (alignments) => {
                this.alignments = alignments;
            },
            error: (err) => {
                // todo handle this
            }
        })
    }

    isAlignmentSelected(alignment: number): boolean {
        return this.selectedAlignment === alignment || (this.characterService?.character?.alignment?.id ?? 0) === alignment;
    }

    selectAlignment(alignment: number) {
        this.selectedAlignment = alignment;
    }

    setAlignment(): void {
        if (this.selectedAlignment === 0)
            return;

        this.characterService.setAlignment(this.selectedAlignment).subscribe({
            next: (character) => {
                this.characterService.character = character;
                this.router.navigate([`/characters/${character.guid}/edit/background`]);
            },
            error: () => {

            }
        });
    }

    getSelectedAlignmentDescription(): string {
        if (this.selectedAlignment === 0)
            return '';

        const matchedAlignment = this.alignments.find(a => {
            return a.id === this.selectedAlignment;
        });

        return matchedAlignment?.description ?? '';
    }
}
