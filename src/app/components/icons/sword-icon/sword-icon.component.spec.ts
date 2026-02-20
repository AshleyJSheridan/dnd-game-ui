import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwordIconComponent } from './sword-icon.component';

describe('SwordIconComponent', () => {
  let component: SwordIconComponent;
  let fixture: ComponentFixture<SwordIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwordIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwordIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
