import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterSkillsComponent } from './edit-character-skills.component';

describe('EditCharacterSkillsComponent', () => {
  let component: EditCharacterSkillsComponent;
  let fixture: ComponentFixture<EditCharacterSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterSkillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
