import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageIconComponent } from './damage-icon.component';

describe('DamageIconComponent', () => {
  let component: DamageIconComponent;
  let fixture: ComponentFixture<DamageIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamageIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamageIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
