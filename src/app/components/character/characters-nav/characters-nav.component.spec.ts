import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharactersNavComponent } from './characters-nav.component';

describe('CharactersNavComponent', () => {
  let component: CharactersNavComponent;
  let fixture: ComponentFixture<CharactersNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharactersNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
