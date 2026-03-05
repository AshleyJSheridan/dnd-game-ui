import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterCreatorComponent } from './encounter-creator.component';

describe('EncounterCreatorComponent', () => {
  let component: EncounterCreatorComponent;
  let fixture: ComponentFixture<EncounterCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncounterCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncounterCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
