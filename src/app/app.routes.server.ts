import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
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
