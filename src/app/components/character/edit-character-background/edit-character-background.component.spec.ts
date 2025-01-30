import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterBackgroundComponent } from './edit-character-background.component';

describe('EditCharacterBackgroundComponent', () => {
  let component: EditCharacterBackgroundComponent;
  let fixture: ComponentFixture<EditCharacterBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
