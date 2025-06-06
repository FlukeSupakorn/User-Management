import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'documents', 
    loadComponent: () => import('./documents/documents.component').then(m => m.DocumentsComponent) 
  },
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];
