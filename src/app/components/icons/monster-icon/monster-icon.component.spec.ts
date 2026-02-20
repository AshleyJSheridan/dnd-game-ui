import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterIconComponent } from './monster-icon.component';

describe('MonsterIconComponent', () => {
  let component: MonsterIconComponent;
  let fixture: ComponentFixture<MonsterIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonsterIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
