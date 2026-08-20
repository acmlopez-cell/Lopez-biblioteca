import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-administracion-libros',
  standalone: true,

  imports: [
    MatButtonModule,
    MatCard,
    MatIconModule,
  ],

  templateUrl: './administracion-libros.html',
})
export class AdministracionLibrosComponent {}