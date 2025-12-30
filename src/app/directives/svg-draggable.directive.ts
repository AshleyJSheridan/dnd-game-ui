import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    Output,
} from '@angular/core';

export interface SvgDragDropEvent {
    id?: string;
    start: { x: number; y: number };
    end: { x: number; y: number };
    delta: { dx: number; dy: number };
}

@Directive({
    selector: '[svgDraggable]',
    standalone: true,
})
export class SvgDraggableDirective implements OnDestroy {
    @Input() dragId?: string;
    @Input() enabled = false;

    /** Optional: snap movement to a grid size (e.g. 10). */
    @Input() snap = 0;

    /** Fired when pointer is released (drop complete). */
    @Output() dragDrop = new EventEmitter<SvgDragDropEvent>();

    private svg!: SVGSVGElement;
    private dragging = false;

    private startPointerSvg = { x: 0, y: 0 };
    private startTranslate = { x: 0, y: 0 };
    private currentTranslate = { x: 0, y: 0 };

    private pointerId: number | null = null;

    constructor(
        private elRef: ElementRef<SVGGElement>,
        private zone: NgZone
    ) {}

    ngOnDestroy(): void {
        // nothing special; pointer listeners are HostListeners
    }

    // --- Pointer down starts drag ---
    @HostListener('pointerdown', ['$event'])
    onPointerDown(ev: PointerEvent) {
        if (!this.enabled)
            return;

        const g = this.elRef.nativeElement;

        // Only left button for mouse; touch/pen will have button===0 anyway.
        if (ev.pointerType === 'mouse' && ev.button !== 0)
            return;

        this.svg = (g.ownerSVGElement as SVGSVGElement)!;
        if (!this.svg)
            return;

        ev.preventDefault();

        // Capture pointer so we keep receiving move/up events
        g.setPointerCapture(ev.pointerId);
        this.pointerId = ev.pointerId;

        this.dragging = true;
        this.startPointerSvg = this.getPointerInSvgCoords(ev);

        // Read existing translate from transform (if any)
        this.startTranslate = this.readTranslate(g);
        this.currentTranslate = { ...this.startTranslate };

        // Optional: add a CSS class while dragging
        g.classList.add('is-dragging');
    }

    // --- Pointer move updates transform live ---
    @HostListener('pointermove', ['$event'])
    onPointerMove(ev: PointerEvent) {
        if (!this.dragging)
            return;

        if (this.pointerId !== null && ev.pointerId !== this.pointerId)
            return;

        const g = this.elRef.nativeElement;

        // Run DOM writes outside Angular change detection for smoothness
        this.zone.runOutsideAngular(() => {
            const pt = this.getPointerInSvgCoords(ev);

            let dx = pt.x - this.startPointerSvg.x;
            let dy = pt.y - this.startPointerSvg.y;

            let x = this.startTranslate.x + dx;
            let y = this.startTranslate.y + dy;

            if (this.snap > 0) {
                x = Math.round(x / this.snap) * this.snap;
                y = Math.round(y / this.snap) * this.snap;
            }

            this.currentTranslate = { x, y };

            // Preserve any non-translate transforms you might have by re-writing carefully.
            // This implementation assumes translate is the primary transform.
            g.setAttribute('transform', `translate(${x} ${y})`);
        });
    }

    // --- Pointer up ends drag + emits drop event ---
    @HostListener('pointerup', ['$event'])
    @HostListener('pointercancel', ['$event'])
    onPointerUp(ev: PointerEvent) {
        if (!this.dragging)
            return;

        if (this.pointerId !== null && ev.pointerId !== this.pointerId)
            return;

        const g = this.elRef.nativeElement;

        this.dragging = false;
        this.pointerId = null;
        g.classList.remove('is-dragging');

        const endPointerSvg = this.getPointerInSvgCoords(ev);

        const delta = {
            dx: this.currentTranslate.x - this.startTranslate.x,
            dy: this.currentTranslate.y - this.startTranslate.y,
        };

        // Emit inside Angular so templates update reliably
        this.zone.run(() => {
            this.dragDrop.emit({
                id: this.dragId ?? g.id ?? undefined,
                start: { ...this.startTranslate },
                end: { ...this.currentTranslate },
                delta,
            });
        });
    }

    /** Convert screen pointer coords -> SVG user coords (respects viewBox). */
    private getPointerInSvgCoords(ev: PointerEvent): { x: number; y: number } {
        const pt = this.svg.createSVGPoint();
        pt.x = ev.clientX;
        pt.y = ev.clientY;

        const ctm = this.svg.getScreenCTM();
        if (!ctm) return { x: 0, y: 0 };

        const svgPt = pt.matrixTransform(ctm.inverse());
        return { x: svgPt.x, y: svgPt.y };
    }

    /** Read translate(x y) from the element's transform attribute. */
    private readTranslate(g: SVGGElement): { x: number; y: number } {
        const tf = g.getAttribute('transform') ?? '';

        // supports: translate(12 34) or translate(12,34)
        const m = tf.match(/translate\(\s*([-\d.]+)(?:[ ,]\s*([-\d.]+))?\s*\)/);
        if (!m)
            return { x: 0, y: 0 };

        const x = parseFloat(m[1]);
        const y = parseFloat(m[2] ?? '0');

        return { x: isFinite(x) ? x : 0, y: isFinite(y) ? y : 0 };
    }
}
