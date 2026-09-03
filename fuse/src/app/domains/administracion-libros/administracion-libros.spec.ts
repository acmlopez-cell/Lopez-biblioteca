import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionLibrosComponent } from './administracion-libros';

describe('AdministracionLibrosComponent', () => {
  let component: AdministracionLibrosComponent;
  let fixture: ComponentFixture<AdministracionLibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionLibrosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministracionLibrosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});