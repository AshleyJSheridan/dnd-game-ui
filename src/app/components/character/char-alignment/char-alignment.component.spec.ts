import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharAlignmentComponent } from './char-alignment.component';

describe('CharAlignmentComponent', () => {
  let component: CharAlignmentComponent;
  let fixture: ComponentFixture<CharAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharAlignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
