import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryBackgroundsComponent } from './library-backgrounds.component';

describe('LibraryBackgroundsComponent', () => {
  let component: LibraryBackgroundsComponent;
  let fixture: ComponentFixture<LibraryBackgroundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryBackgroundsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryBackgroundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
