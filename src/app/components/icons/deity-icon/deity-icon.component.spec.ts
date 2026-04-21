import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeityIconComponent } from './deity-icon.component';

describe('DeityIconComponent', () => {
  let component: DeityIconComponent;
  let fixture: ComponentFixture<DeityIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeityIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeityIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
