import {Component, Input, input, InputSignal} from '@angular/core';
import { PaginationConfig } from '../../entities/PaginationConfig';

@Component({
    selector: 'app-pagination',
    imports: [],
    templateUrl: './pagination.component.html',
})
export class PaginationComponent {
    readonly paginationConfig: InputSignal<PaginationConfig|undefined> = input<PaginationConfig>();

    public getTotalPages(): Array<number> {
        if (!this.paginationConfig())
            return [1];

        const totalPages =  Math.ceil(this.paginationConfig()!.totalItems / this.paginationConfig()!.perPage);

        return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    public goToPage(page: number) {
        this.paginationConfig()!.currentPage = page;
    }
}
