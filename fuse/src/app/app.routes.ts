import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },

  // Admin
  {
    path: 'admin',
    loadComponent: () =>
      import('./domains/admin/layout/layout').then(
        (m) => m.AdminLayout
      ),
    children: [
      {
        path: 'administracion-libros',
        loadComponent: () =>
          import('./domains/administracion-libros/administracion-libros').then(
            (m) => m.AdministracionLibrosComponent
          ),
      },
    ],
  },

  // Website
  {
    path: 'home',
    loadChildren: () => import('./domains/website/routes'),
  },

  // Auth
  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/routes'),
  },

  // Coming soon
  {
    path: 'coming-soon',
    loadChildren: () => import('./domains/coming-soon/routes'),
  },

  // Maintenance
  {
    path: 'maintenance',
    loadChildren: () => import('./domains/maintenance/routes'),
  },

  // Cualquier ruta que no exista
  {
    path: '**',
    redirectTo: 'admin',
  },
];