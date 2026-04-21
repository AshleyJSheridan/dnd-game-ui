import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceIconComponent } from './race-icon.component';

describe('RaceIconComponent', () => {
  let component: RaceIconComponent;
  let fixture: ComponentFixture<RaceIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
