import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectrumComponent } from './electrum.component';

describe('ElectrumComponent', () => {
  let component: ElectrumComponent;
  let fixture: ComponentFixture<ElectrumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectrumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
