import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeIconComponent } from './item-type-icon.component';

describe('ItemTypeIconComponent', () => {
  let component: ItemTypeIconComponent;
  let fixture: ComponentFixture<ItemTypeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemTypeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
