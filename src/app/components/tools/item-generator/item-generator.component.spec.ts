import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGeneratorComponent } from './item-generator.component';

describe('ItemGeneratorComponent', () => {
  let component: ItemGeneratorComponent;
  let fixture: ComponentFixture<ItemGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
