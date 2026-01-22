import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeOnIconComponent } from './eye-on-icon.component';

describe('EyeOnIconComponent', () => {
  let component: EyeOnIconComponent;
  let fixture: ComponentFixture<EyeOnIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeOnIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyeOnIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
