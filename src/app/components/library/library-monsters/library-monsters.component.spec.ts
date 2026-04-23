import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryMonstersComponent } from './library-monsters.component';

describe('LibraryMonstersComponent', () => {
  let component: LibraryMonstersComponent;
  let fixture: ComponentFixture<LibraryMonstersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryMonstersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryMonstersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
