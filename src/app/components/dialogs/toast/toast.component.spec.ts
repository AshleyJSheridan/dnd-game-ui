import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function visibleMessages(): string[] {
    fixture.detectChanges();
    return Array.from(fixture.nativeElement.querySelectorAll('.toast-content > div'))
      .map(element => (element as HTMLElement).textContent!.trim());
  }

  it('expires overlapping messages independently, including duplicates', fakeAsync(() => {
    component.showToast('Dice result');
    tick(1000);
    component.showToast('Dice result');
    expect(visibleMessages()).toEqual(['Dice result', 'Dice result']);

    tick(2000);
    expect(visibleMessages()).toEqual(['Dice result']);

    tick(1000);
    expect(visibleMessages()).toEqual([]);
    expect(fixture.nativeElement.querySelector('.toast-content')).toBeNull();
  }));

  it('uses the configured timeout for each new message', fakeAsync(() => {
    fixture.componentRef.setInput('timeout', 6000);
    component.showToast('Long message');
    tick(1000);
    fixture.componentRef.setInput('timeout', 1000);
    component.showToast('Short message');

    tick(1000);
    expect(visibleMessages()).toEqual(['Long message']);

    tick(4000);
    expect(visibleMessages()).toEqual([]);
  }));

  it('cancels pending timers when destroyed', fakeAsync(() => {
    const clearTimeout = spyOn(window, 'clearTimeout').and.callThrough();
    component.showToast('First');
    component.showToast('Second');

    fixture.destroy();

    expect(clearTimeout).toHaveBeenCalledTimes(2);
    tick(3000);
    expect(component.messages.length).toBe(2);
  }));
});
