# Expense Tracker

Applicazione per la gestione delle spese personali, sviluppata come progetto full stack in evoluzione.

Il frontend Angular comunica tramite API REST con un backend Spring Boot. Il progetto è pensato per consolidare la gestione dello stato, i form reattivi, la comunicazione HTTP e la separazione delle responsabilità.

## Stato attuale

Il frontend è in fase di integrazione con il backend.

Sono presenti:

- form reattivo per l'inserimento delle spese;
- validazione di titolo, importo, categoria, descrizione e data;
- stato applicativo gestito con Angular Signals;
- client HTTP dedicato alle operazioni REST;
- pagina di riepilogo delle spese;
- eliminazione delle spese;
- routing per la pagina di dettaglio;
- struttura iniziale per la gestione delle entrate.

La modifica delle spese, il caricamento diretto del dettaglio e la gestione completa degli stati asincroni sono ancora in lavorazione.

## Tecnologie

- Angular 21
- TypeScript 5.9
- Angular Signals
- Angular Reactive Forms
- Angular Router
- Angular HttpClient
- RxJS
- Bootstrap 5
- Vitest
- Spring Boot e MySQL per il backend

## Architettura frontend

- `pages`: orchestrano i casi d'uso dell'applicazione;
- `components`: contengono gli elementi riutilizzabili dell'interfaccia;
- `ExpenseApiService`: gestisce le richieste HTTP verso il backend;
- `ExpenseService`: mantiene lo stato reattivo e coordina le operazioni sui dati;
- `type/expense.ts`: definisce il modello `Expense` e i tipi delle richieste.

## API

Il frontend utilizza attualmente il seguente endpoint locale:

```text
http://localhost:8080/api/expenses
```

Il client HTTP prevede le operazioni:

- `GET /api/expenses`
- `GET /api/expenses/{id}`
- `POST /api/expenses`
- `PUT /api/expenses/{id}`
- `PATCH /api/expenses/{id}`
- `DELETE /api/expenses/{id}`

Per utilizzare le funzionalità collegate ai dati è necessario avviare anche il backend.

## Avvio del frontend

### Requisiti

- Node.js in versione LTS
- npm

```bash
git clone https://github.com/fabiozagaria/expense-tracker-angular.git
cd expense-tracker-angular
npm install
npm start
```

L'applicazione sarà disponibile su:

```text
http://localhost:4200
```

## Prossimi sviluppi

- completare l'integrazione CRUD con il backend;
- gestire caricamento, errori e conferme delle operazioni asincrone;
- completare il dettaglio tramite chiamata API;
- configurare gli endpoint per gli ambienti di sviluppo e produzione;
- completare il flusso delle entrate;
- aggiungere filtri, ordinamento, totali e statistiche;
- ampliare la copertura dei test;
- integrare autenticazione e gestione utenti.

## Stato del progetto

Progetto portfolio in sviluppo attivo. Il frontend non è ancora considerato completo.

## Autore

Fabio Zagaria — Junior Full Stack Developer orientato al backend Java e Spring Boot.
