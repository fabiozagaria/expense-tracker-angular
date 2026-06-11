import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { AggiungiSpesa } from './pages/aggiungi-spesa/aggiungi-spesa';
import { RiepilogoSpesa } from './pages/riepilogo-spesa/riepilogo-spesa';
import { AggiungiEntrate } from './pages/aggiungi-entrate/aggiungi-entrate';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home | Gestionale Spese'
  },
  {
    path: 'aggiungi-spesa',
    component: AggiungiSpesa,
    title: 'Aggiungi Spesa | Gestionale Spese'
  },
  {
    path: 'riepilogo',
    component: RiepilogoSpesa,
    title: 'Riepilogo | Gestionale Spese'
  },
  {
    path: 'aggiungi-entrate',
    component: AggiungiEntrate,
    title: 'Aggiungi Entrate | Gestionale Spese'
  }
];
