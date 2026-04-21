import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarySpellsListComponent } from './library-spells-list.component';

describe('LibrarySpellsListComponent', () => {
  let component: LibrarySpellsListComponent;
  let fixture: ComponentFixture<LibrarySpellsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrarySpellsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrarySpellsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
