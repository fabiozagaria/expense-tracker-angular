# Expense Tracker — Applicazione Angular

Applicazione frontend per registrare, consultare e modificare spese personali. Il progetto applica Reactive Forms, Signals, routing e comunicazione tra componenti in un caso d'uso concreto.

[Demo online](https://gestionale-spese.vercel.app/)

## Competenze dimostrate

- modellazione tipizzata del dominio `Expense`;
- form reattivi e validazione dei dati;
- stato centralizzato con Angular Signals;
- separazione tra pagine, componenti e service;
- comunicazione padre-figlio tramite input e output;
- routing statico e dinamico;
- gestione di operazioni di creazione, modifica ed eliminazione.

## Funzionalità implementate

- inserimento di una nuova spesa;
- validazione di titolo, importo, categoria, descrizione e data;
- elenco riepilogativo delle spese;
- modifica inline di titolo e descrizione;
- eliminazione di una spesa;
- pagina di dettaglio tramite identificativo;
- navigazione tra home, inserimento, riepilogo e dettaglio.

È presente anche la struttura iniziale del form per le entrate, non ancora collegata a uno stato persistente.

## Tecnologie

- Angular 21
- TypeScript 5.9
- Angular Signals
- Angular Reactive Forms
- Angular Router
- Bootstrap 5
- Vitest come test runner configurato

## Architettura

- `ExpenseService`: mantiene lo stato reattivo e applica le operazioni sui dati;
- `pages`: orchestrano i diversi casi d'uso;
- `ExpenseList`: visualizza una spesa ed emette gli eventi di modifica o eliminazione;
- `type/expense.ts`: definisce i tipi del dominio.

## Persistenza attuale

I dati sono mantenuti in memoria. Un aggiornamento della pagina azzera lo stato: non sono ancora presenti `localStorage`, backend o database.

## Avvio in locale

### Requisiti

- Node.js in versione LTS
- npm

```bash
git clone https://github.com/fabiozagaria/expense-tracker-angular.git
cd expense-tracker-angular
npm install
npm start
```

L'applicazione sarà disponibile su `http://localhost:4200`.

## Sviluppi successivi

- completamento del flusso delle entrate;
- persistenza locale;
- filtri, ordinamento, totali e statistiche;
- integrazione con backend Spring Boot e MySQL;
- autenticazione e gestione utenti.

## Stato

Progetto portfolio in evoluzione. Le funzionalità elencate come implementate corrispondono allo stato attuale del codice.

## Autore

Fabio Zagaria — Junior Backend Developer con competenze Angular.
