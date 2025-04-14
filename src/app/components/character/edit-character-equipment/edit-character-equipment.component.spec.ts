import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterEquipmentComponent } from './edit-character-equipment.component';

describe('EditCharacterEquipmentComponent', () => {
  let component: EditCharacterEquipmentComponent;
  let fixture: ComponentFixture<EditCharacterEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacterEquipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacterEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
