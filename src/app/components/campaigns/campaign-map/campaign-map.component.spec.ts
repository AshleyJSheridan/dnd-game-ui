import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMapComponent } from './campaign-map.component';

describe('CampaignMapComponent', () => {
  let component: CampaignMapComponent;
  let fixture: ComponentFixture<CampaignMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
