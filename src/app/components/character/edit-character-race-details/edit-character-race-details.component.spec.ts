import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterRaceDetailsComponent } from './edit-character-race-details.component';

describe('EditCharacterRaceDetailsComponent', () => {
  let component: EditCharacterRaceDetailsComponent;
  let fixture: ComponentFixture<EditCharacterRaceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterRaceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterRaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
