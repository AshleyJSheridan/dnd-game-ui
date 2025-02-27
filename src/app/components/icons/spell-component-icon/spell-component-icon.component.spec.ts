import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellComponentIconComponent } from './spell-component-icon.component';

describe('SpellComponentIconComponent', () => {
  let component: SpellComponentIconComponent;
  let fixture: ComponentFixture<SpellComponentIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpellComponentIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellComponentIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
