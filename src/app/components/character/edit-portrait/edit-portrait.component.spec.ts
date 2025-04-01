import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPortraitComponent } from './edit-portrait.component';

describe('EditPortraitComponent', () => {
  let component: EditPortraitComponent;
  let fixture: ComponentFixture<EditPortraitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPortraitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPortraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
