import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterClassComponent } from './edit-character-class.component';

describe('EditCharacterClassComponent', () => {
  let component: EditCharacterClassComponent;
  let fixture: ComponentFixture<EditCharacterClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
