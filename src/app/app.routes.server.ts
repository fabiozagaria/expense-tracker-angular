import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard',
    renderMode: RenderMode.Client
  },
  {
    path: 'add-transaction',
    renderMode: RenderMode.Client
  },
  {
    path: 'add-income',
    renderMode: RenderMode.Client
  },
  {
    path: 'add-expense',
    renderMode: RenderMode.Client
  },
  {
    path: 'summary',
    renderMode: RenderMode.Client
  },
  {
    path: 'expenses/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'verify-email',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
