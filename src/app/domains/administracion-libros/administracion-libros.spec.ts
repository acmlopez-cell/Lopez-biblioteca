import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionLibros } from './administracion-libros';

describe('AdministracionLibros', () => {
  let component: AdministracionLibros;
  let fixture: ComponentFixture<AdministracionLibros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionLibros],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministracionLibros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
