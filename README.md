# Expense Tracker — Gestionale Spese

Applicazione Angular per registrare e consultare le spese personali. Il progetto mette al centro form reattivi, stato con Signals, componenti riutilizzabili e routing.

[Demo live](https://gestionale-spese.vercel.app/)

## Funzionalità implementate

- inserimento di una spesa tramite Reactive Forms;
- validazione dei campi e messaggi di errore;
- stato centralizzato con Angular Signals;
- riepilogo delle spese tramite card riutilizzabili;
- modifica inline di titolo e descrizione;
- eliminazione di una spesa;
- pagina di dettaglio tramite rotta dinamica;
- struttura iniziale del form per le entrate;
- navigazione tra le sezioni tramite Angular Router.

## Tecnologie

- Angular 21
- TypeScript 5.9
- Angular Signals
- Angular Reactive Forms
- Angular Router
- Bootstrap 5
- Vitest

## Architettura

```text
src/app
├── components
│   └── expense-list
├── layout
├── pages
│   ├── aggiungi-entrate
│   ├── aggiungi-spesa
│   ├── dettaglio-spesa
│   ├── home-page
│   └── riepilogo-spesa
├── services
│   └── spesa-service.ts
├── type
│   └── spesa.ts
└── app.routes.ts
```

`SpesaService` rappresenta la fonte centrale dello stato. Le pagine orchestrano i casi d'uso, mentre `ExpenseList` visualizza una singola spesa ed emette eventi di modifica o eliminazione.

## Persistenza

I dati sono mantenuti in memoria: ricaricando la pagina vengono persi. Non sono ancora presenti backend, database o autenticazione.

## Avvio in locale

### Requisiti

- Node.js in versione LTS
- npm

```bash
git clone https://github.com/fabiozagaria/gestionale-spese.git
cd gestionale-spese
npm install
npm start
```

L'applicazione sarà disponibile su `http://localhost:4200`.

## Validazione delle spese

Il form controlla titolo, importo, categoria, descrizione e data. Gli errori vengono mostrati soltanto quando necessario, mantenendo la logica di validazione nel componente e il template leggibile.

## Roadmap

- completare il flusso delle entrate;
- aggiungere persistenza locale;
- introdurre filtri, ordinamento e totali;
- integrare grafici e statistiche;
- collegare un backend Spring Boot con MySQL;
- aggiungere utenti e autenticazione.

## Stato del progetto

Progetto portfolio in evoluzione. Le funzionalità dichiarate sopra corrispondono allo stato attuale del codice; la roadmap indica soltanto sviluppi futuri.

## Autore

Sviluppato da [Fabio Zagaria](https://github.com/fabiozagaria).
