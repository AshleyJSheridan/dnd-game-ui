import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterAbilitiesComponent } from './edit-character-abilities.component';

describe('EditCharacterAbilitiesComponent', () => {
  let component: EditCharacterAbilitiesComponent;
  let fixture: ComponentFixture<EditCharacterAbilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterAbilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
