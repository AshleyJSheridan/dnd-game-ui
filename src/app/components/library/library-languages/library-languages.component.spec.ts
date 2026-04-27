import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryLanguagesComponent } from './library-languages.component';

describe('LibraryLanguagesComponent', () => {
  let component: LibraryLanguagesComponent;
  let fixture: ComponentFixture<LibraryLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryLanguagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
