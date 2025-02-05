import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterRaceComponent } from './edit-character-race.component';

describe('EditCharacterRaceComponent', () => {
  let component: EditCharacterRaceComponent;
  let fixture: ComponentFixture<EditCharacterRaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterRaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
