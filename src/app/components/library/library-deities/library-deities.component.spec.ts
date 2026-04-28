import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryDeitiesComponent } from './library-deities.component';

describe('LibraryDeitiesComponent', () => {
  let component: LibraryDeitiesComponent;
  let fixture: ComponentFixture<LibraryDeitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryDeitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryDeitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
