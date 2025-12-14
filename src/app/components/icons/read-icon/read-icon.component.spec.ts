import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadIconComponent } from './read-icon.component';

describe('ReadIconComponent', () => {
  let component: ReadIconComponent;
  let fixture: ComponentFixture<ReadIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
