import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryConditionsComponent } from './library-conditions.component';

describe('LibraryConditionsComponent', () => {
  let component: LibraryConditionsComponent;
  let fixture: ComponentFixture<LibraryConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
