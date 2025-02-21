import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharClassFeatureIconComponent } from './char-class-feature-icon.component';

describe('CharClassFeatureIconComponent', () => {
  let component: CharClassFeatureIconComponent;
  let fixture: ComponentFixture<CharClassFeatureIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharClassFeatureIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharClassFeatureIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
