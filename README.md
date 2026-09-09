# Gestionale Spese — Frontend Angular

![Versione](https://img.shields.io/badge/versione-0.3.0-blue)
![Stato](https://img.shields.io/badge/stato-in%20sviluppo-orange)

**Versione attuale: 0.3.0 — verticale Expense full stack in sviluppo.**

Frontend del progetto full stack **Gestionale Spese**, attualmente focalizzato sulla registrazione, consultazione e modifica delle spese personali.

L'applicazione è sviluppata con Angular e comunica tramite API REST con un backend Spring Boot mantenuto in un repository separato.

- [Demo frontend](https://gestionale-spese.vercel.app/)
- [Repository backend](https://github.com/fabiozagaria/expense-tracker-api)

## Stato del progetto

**In sviluppo attivo.**

Il verticale delle spese è collegato alle API per lettura, creazione e modifica. Dashboard, entrate, autenticazione e movimento generico non fanno parte della versione 0.3.0 e sono state rimosse dalla navigazione e dalle route pubbliche finché non saranno realmente implementate. La demo pubblica mostra l'interfaccia; le operazioni persistenti richiedono il backend.

## Funzionalità presenti

- navigazione tra home, elenco spese, aggiunta e dettaglio;
- form reattivo per l'inserimento delle spese;
- validazione di titolo, importo, categoria, descrizione e data;
- stato applicativo gestito con Angular Signals;
- caricamento dell'elenco delle spese tramite API;
- aggiunta, modifica e rimozione di una spesa;
- pagina di riepilogo e route di dettaglio;
- gestione iniziale degli stati di caricamento ed errore;
- client HTTP tipizzato per le operazioni REST previste.

## Tecnologie

- Angular 21
- TypeScript 5.9
- Angular Signals
- Reactive Forms
- Angular Router
- Angular HttpClient
- RxJS
- Bootstrap 5
- Vitest

## Architettura frontend

| Area                  | Responsabilità                                                              |
| --------------------- | --------------------------------------------------------------------------- |
| `ExpenseApiService`   | Espone le chiamate HTTP verso il backend                                    |
| `ExpenseService`      | Mantiene lo stato con Signals e coordina caricamento, creazione e rimozione |
| `expense.ts`          | Definisce modello, categorie e tipi delle richieste                         |
| Componenti `expenses` | Gestiscono form, lista, riepilogo e dettaglio                               |
| `app.routes.ts`       | Definisce le rotte e i titoli delle pagine                                  |

## Integrazione con il backend

Il client utilizza in sviluppo:

```text
http://localhost:8080/api/expenses
```

Contratto REST previsto dal frontend:

| Metodo   | Endpoint             | Utilizzo               |
| -------- | -------------------- | ---------------------- |
| `GET`    | `/api/expenses`      | Elenco delle spese     |
| `GET`    | `/api/expenses/{id}` | Dettaglio di una spesa |
| `POST`   | `/api/expenses`      | Creazione              |
| `PUT`    | `/api/expenses/{id}` | Aggiornamento completo |
| `PATCH`  | `/api/expenses/{id}` | Aggiornamento parziale |
| `DELETE` | `/api/expenses/{id}` | Eliminazione           |

Il backend espone l'intero CRUD del dominio `Expense`. Alcune integrazioni frontend e la gestione completa degli stati UI sono ancora in consolidamento.

## Avvio locale

### Requisiti

- Node.js in versione LTS
- npm

```bash
git clone https://github.com/fabiozagaria/expense-tracker-angular.git
cd expense-tracker-angular
npm ci
npm start
```

Il frontend sarà disponibile su `http://localhost:4200`.

Per le funzionalità collegate ai dati è necessario avviare anche il [backend Spring Boot](https://github.com/fabiozagaria/expense-tracker-api).

## Verifiche

```bash
npm test
npm run build
```

## Prossimi sviluppi

1. completare e verificare l'editing inline con Reactive Forms;
2. collegare e verificare tutti gli endpoint del verticale Expense;
3. gestire in modo uniforme caricamento, errori e conferme;
4. configurare gli endpoint per sviluppo e produzione;
5. ampliare test unitari e di integrazione;
6. introdurre successivamente entrate, dashboard e autenticazione.

## Versioning

Il progetto segue [Semantic Versioning](https://semver.org/):

- `0.x.y`: sviluppo attivo, API e funzionalità ancora soggette a cambiamenti;
- incremento `PATCH` (`0.3.1`) per correzioni compatibili;
- incremento `MINOR` (`0.4.0`) per nuove funzionalità durante lo sviluppo;
- `1.0.0` quando l'MVP sarà stabile, verificato e distribuibile.

## Autore

Fabio Zagaria — Junior Backend Developer con competenze full stack.
