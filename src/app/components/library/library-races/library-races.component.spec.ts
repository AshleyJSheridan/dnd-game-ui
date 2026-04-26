import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryRacesComponent } from './library-races.component';

describe('LibraryRacesComponent', () => {
  let component: LibraryRacesComponent;
  let fixture: ComponentFixture<LibraryRacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryRacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryRacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
