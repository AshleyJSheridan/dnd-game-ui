import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionIconComponent } from './description-icon.component';

describe('DescriptionIconComponent', () => {
  let component: DescriptionIconComponent;
  let fixture: ComponentFixture<DescriptionIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
