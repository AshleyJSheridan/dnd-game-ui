import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryClassesComponent } from './library-classes.component';

describe('LibraryClassesComponent', () => {
  let component: LibraryClassesComponent;
  let fixture: ComponentFixture<LibraryClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
