import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveIconComponent } from './give-icon.component';

describe('GiveIconComponent', () => {
  let component: GiveIconComponent;
  let fixture: ComponentFixture<GiveIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiveIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
