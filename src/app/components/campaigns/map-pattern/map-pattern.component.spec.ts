import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPatternComponent } from './map-pattern.component';

describe('MapPatternComponent', () => {
  let component: MapPatternComponent;
  let fixture: ComponentFixture<MapPatternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPatternComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
