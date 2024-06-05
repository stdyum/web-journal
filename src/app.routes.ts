import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/journal-options/journal-options.component').then(c => c.JournalOptionsComponent),
  },
  {
    path: 'view',
    loadComponent: () => import('./pages/journal-view/journal-view.component').then(c => c.JournalViewComponent),
  },
  { path: '**', redirectTo: '' },
];
