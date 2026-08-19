# Gestionale Spese — Frontend Angular

Frontend del progetto full stack **Gestionale Spese**, pensato per registrare, consultare e organizzare entrate e uscite personali.

L'applicazione è sviluppata con Angular e comunica tramite API REST con un backend Spring Boot mantenuto in un repository separato.

- [Demo frontend](https://gestionale-spese.vercel.app/)
- [Repository backend](https://github.com/fabiozagaria/expense-tracker-api)

## Stato del progetto

**In sviluppo attivo.**

Il flusso delle spese è parzialmente collegato alle API. Dashboard, entrate, autenticazione e aggiornamento completo dei dati sono ancora in lavorazione. La demo pubblica mostra l'interfaccia, ma le operazioni che richiedono dati dipendono dal backend.

## Funzionalità presenti

- navigazione tra home, dashboard, login, movimenti, entrate e spese;
- form reattivo per l'inserimento delle spese;
- validazione di titolo, importo, categoria, descrizione e data;
- stato applicativo gestito con Angular Signals;
- caricamento dell'elenco delle spese tramite API;
- aggiunta e rimozione di una spesa;
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

Il backend è ancora in fase iniziale: il contratto sopra descrive le chiamate già predisposte nel client, non endpoint tutti già disponibili.

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

1. completare gli endpoint e il contratto dati del backend;
2. collegare dettaglio, modifica completa e modifica parziale;
3. gestire in modo uniforme caricamento, errori e conferme;
4. rendere dinamici dashboard, saldo, entrate e ultimi movimenti;
5. configurare gli endpoint per sviluppo e produzione;
6. ampliare test unitari e di integrazione;
7. introdurre autenticazione e gestione utenti.

## Autore

Fabio Zagaria — Junior Backend Developer con competenze full stack.
