import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignStateComponent } from './campaign-state.component';

describe('CampaignStateComponent', () => {
  let component: CampaignStateComponent;
  let fixture: ComponentFixture<CampaignStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
