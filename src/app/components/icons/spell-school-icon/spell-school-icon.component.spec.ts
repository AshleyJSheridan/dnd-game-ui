import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellSchoolIconComponent } from './spell-school-icon.component';

describe('SpellSchoolIconComponent', () => {
  let component: SpellSchoolIconComponent;
  let fixture: ComponentFixture<SpellSchoolIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpellSchoolIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellSchoolIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
