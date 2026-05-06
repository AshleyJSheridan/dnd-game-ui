import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryDamageTypesComponent } from './library-damage-types.component';

describe('LibraryDamageTypesComponent', () => {
  let component: LibraryDamageTypesComponent;
  let fixture: ComponentFixture<LibraryDamageTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryDamageTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryDamageTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
