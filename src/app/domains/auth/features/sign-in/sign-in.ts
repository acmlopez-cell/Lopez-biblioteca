import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.html',
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormField,
    MatDivider,
  ],
})
export default class AuthSignIn {
  // Dependencies
  private router = inject(Router);
  private authService = inject(AuthService);

  // State
  protected signInFormModel = signal({
    username: 'admin',
    password: 'admin',
  });

  protected signInForm = form(this.signInFormModel, (form) => {
    required(form.username, {
      message: 'Debes ingresar tu usuario',
    });

    required(form.password, {
      message: 'Debes ingresar tu contraseña',
    });
  });

  signIn(event: Event) {
    event.preventDefault();

    submit(this.signInForm, async () => {
      const { username, password } = this.signInFormModel();

      try {
        await this.authService.signIn(username, password).toPromise();

        await this.router.navigateByUrl('/admin/dashboards');
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    });
  }
}