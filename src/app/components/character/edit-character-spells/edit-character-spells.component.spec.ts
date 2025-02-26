import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterSpellsComponent } from './edit-character-spells.component';

describe('EditCharacterSpellsComponent', () => {
  let component: EditCharacterSpellsComponent;
  let fixture: ComponentFixture<EditCharacterSpellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterSpellsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterSpellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
