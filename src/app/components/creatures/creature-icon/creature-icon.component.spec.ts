import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureIconComponent } from './creature-icon.component';

describe('CreatureIconComponent', () => {
  let component: CreatureIconComponent;
  let fixture: ComponentFixture<CreatureIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatureIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatureIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
