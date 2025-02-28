import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterSpellComponent } from './edit-character-spell.component';

describe('EditCharacterSpellComponent', () => {
  let component: EditCharacterSpellComponent;
  let fixture: ComponentFixture<EditCharacterSpellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterSpellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
