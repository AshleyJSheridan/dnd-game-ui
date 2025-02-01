import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharBackgroundIconComponent } from './char-background-icon.component';

describe('CharBackgroundIconComponent', () => {
  let component: CharBackgroundIconComponent;
  let fixture: ComponentFixture<CharBackgroundIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharBackgroundIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharBackgroundIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
