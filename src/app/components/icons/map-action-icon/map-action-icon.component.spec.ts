import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapActionIconComponent } from './map-action-icon.component';

describe('MapActionIconComponent', () => {
  let component: MapActionIconComponent;
  let fixture: ComponentFixture<MapActionIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapActionIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapActionIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
