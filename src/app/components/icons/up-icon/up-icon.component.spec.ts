import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpIconComponent } from './up-icon.component';

describe('UpIconComponent', () => {
  let component: UpIconComponent;
  let fixture: ComponentFixture<UpIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
