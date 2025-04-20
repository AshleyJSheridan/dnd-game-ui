import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToInventoryIconComponent } from './add-to-inventory-icon.component';

describe('AddToInventoryIconComponent', () => {
  let component: AddToInventoryIconComponent;
  let fixture: ComponentFixture<AddToInventoryIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToInventoryIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToInventoryIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
