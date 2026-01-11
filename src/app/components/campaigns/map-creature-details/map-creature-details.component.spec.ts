import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCreatureDetailsComponent } from './map-creature-details.component';

describe('MapCreatureDetailsComponent', () => {
  let component: MapCreatureDetailsComponent;
  let fixture: ComponentFixture<MapCreatureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapCreatureDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapCreatureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
