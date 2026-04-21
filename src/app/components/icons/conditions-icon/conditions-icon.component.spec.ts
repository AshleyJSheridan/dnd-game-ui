import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsIconComponent } from './conditions-icon.component';

describe('ConditionsIconComponent', () => {
  let component: ConditionsIconComponent;
  let fixture: ComponentFixture<ConditionsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionsIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
