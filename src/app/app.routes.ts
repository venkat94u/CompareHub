import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'CompareHub | Fast Privacy-First Compare Tool',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'text-compare',
    title: 'Text Compare | CompareHub',
    loadComponent: () => import('./features/text-compare/text-compare.component').then(m => m.TextCompareComponent)
  },
  {
    path: 'json-compare',
    title: 'JSON Compare | CompareHub',
    loadComponent: () => import('./features/json-compare/json-compare.component').then(m => m.JsonCompareComponent)
  },
  {
    path: 'code-compare',
    title: 'Code Compare | CompareHub',
    loadComponent: () => import('./features/code-compare/code-compare.component').then(m => m.CodeCompareComponent)
  },
  { path: '**', redirectTo: '' }
];
