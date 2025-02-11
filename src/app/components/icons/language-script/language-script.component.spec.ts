import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageScriptComponent } from './language-script.component';

describe('LanguageScriptComponent', () => {
  let component: LanguageScriptComponent;
  let fixture: ComponentFixture<LanguageScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageScriptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
