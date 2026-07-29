import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolledDiceComponent } from './rolled-dice.component';

describe('RolledDiceComponent', () => {
  let component: RolledDiceComponent;
  let fixture: ComponentFixture<RolledDiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolledDiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolledDiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
