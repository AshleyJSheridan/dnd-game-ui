import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignStateIconComponent } from './campaign-state-icon.component';

describe('CampaignStateIconComponent', () => {
  let component: CampaignStateIconComponent;
  let fixture: ComponentFixture<CampaignStateIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignStateIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignStateIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
