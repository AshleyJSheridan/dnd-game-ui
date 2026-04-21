import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignmentIconComponent } from './alignment-icon.component';

describe('AlignmentIconComponent', () => {
  let component: AlignmentIconComponent;
  let fixture: ComponentFixture<AlignmentIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlignmentIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlignmentIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
