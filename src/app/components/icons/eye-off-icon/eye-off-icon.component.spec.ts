import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeOffIconComponent } from './eye-off-icon.component';

describe('EyeOffIconComponent', () => {
  let component: EyeOffIconComponent;
  let fixture: ComponentFixture<EyeOffIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeOffIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyeOffIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
