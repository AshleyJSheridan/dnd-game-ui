import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceIconComponent } from './dice-icon.component';

describe('DiceIconComponent', () => {
  let component: DiceIconComponent;
  let fixture: ComponentFixture<DiceIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiceIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiceIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
