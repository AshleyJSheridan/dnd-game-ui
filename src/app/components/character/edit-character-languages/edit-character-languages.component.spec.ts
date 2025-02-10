import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterLanguagesComponent } from './edit-character-languages.component';

describe('EditCharacterLanguagesComponent', () => {
  let component: EditCharacterLanguagesComponent;
  let fixture: ComponentFixture<EditCharacterLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterLanguagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
