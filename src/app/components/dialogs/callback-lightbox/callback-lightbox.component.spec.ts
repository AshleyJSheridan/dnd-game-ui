import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackLightboxComponent } from './callback-lightbox.component';

describe('CallbackLightboxComponent', () => {
  let component: CallbackLightboxComponent;
  let fixture: ComponentFixture<CallbackLightboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallbackLightboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallbackLightboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
