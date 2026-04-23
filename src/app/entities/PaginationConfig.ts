export class PaginationConfig {
    currentPage: number;
    perPage: number;
    totalItems: number;

    constructor(currentPage: number = 1, perPage: number = 20, totalItems: number = 0) {
        this.currentPage = currentPage;
        this.perPage = perPage;
        this.totalItems = totalItems;
    }
}
