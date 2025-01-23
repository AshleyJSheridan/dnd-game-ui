import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharClassIconComponent } from './char-class-icon.component';

describe('CharClassIconComponent', () => {
  let component: CharClassIconComponent;
  let fixture: ComponentFixture<CharClassIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharClassIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharClassIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
