# Gestionale Spese — Frontend Angular

![Versione](https://img.shields.io/badge/versione-0.3.0-blue)
![Stato](https://img.shields.io/badge/stato-in%20sviluppo-orange)

**Versione attuale: 0.3.0 — applicazione full stack in consolidamento.**

Frontend del progetto full stack **Gestionale Spese**, con spese personali, inserimento entrate e dashboard.

L'applicazione è sviluppata con Angular e comunica tramite API REST con un backend Spring Boot mantenuto in un repository separato.

- [Demo frontend](https://gestionale-spese.vercel.app/)
- [Repository backend](https://github.com/fabiozagaria/expense-tracker-api)

## Stato del progetto

**In consolidamento: funzionalità presenti, verifica completa nel browser ancora aperta.**

Il verticale delle spese è collegato alle API. Registrazione, verifica email, login, rinnovo della sessione e spese personali sono disponibili in locale con backend, MySQL e Mailpit avviati. La demo pubblica mostra l'interfaccia; le operazioni persistenti richiedono il backend. Le route protette `/dashboard`, `/add-income` e `/add-transaction` sono presenti nel codice. Entrate e riepilogo devono essere verificati end-to-end prima di dichiararli consolidati.

## Scopo e confine della versione

Client Angular del prodotto full stack Expense Tracker: integra UI, form, chiamate REST e autenticazione con il backend. Il prossimo traguardo è un flusso riproducibile nel browser per autenticazione, spese, entrate e riepilogo; nuove funzionalità vengono scelte dopo questa verifica.

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
- registrazione, verifica email e login con JWT per le spese personali;
- rinnovo dell'access token tramite cookie HttpOnly e `POST /auth/refresh`;
- logout e protezione delle route applicative;
- form per inserire entrate e pagina di scelta del tipo di movimento;
- dashboard con totale entrate, totale spese e saldo.

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
| `AuthService`         | Gestisce registrazione, login, refresh e logout con access token in memoria |
| `authInterceptor`     | Aggiunge il Bearer alle API e riprova dopo un refresh riuscito             |
| `authGuard`           | Protegge spese, entrate e dashboard e ripristina la sessione dal cookie |

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

Il backend espone l'intero CRUD del dominio `Expense`, `GET`/`POST /api/incomes` e `GET /api/dashboard/summary`. Le entrate non hanno ancora update/delete. Alcune integrazioni frontend e la gestione completa degli stati UI sono ancora in consolidamento.

L'autenticazione locale usa `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/login`, `POST /auth/refresh` e `POST /auth/logout`. Il backend restituisce l'access token nel corpo del login/refresh e conserva il refresh token in un cookie HttpOnly. Il frontend invia il cookie con `withCredentials` e protegge le rotte `/summary`, `/add-expense`, `/expenses/:id`, `/dashboard`, `/add-income` e `/add-transaction`.

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
Per provare la registrazione, nel repository backend configurare `.env` e avviare `docker compose up --build -d`: partiranno API, MySQL e Mailpit. Il link di verifica è visibile su `http://localhost:8025`. L'integrazione API è configurata per `http://localhost:8080` e richiede il frontend su `http://localhost:4200`.

## Verifiche

```bash
npm test
npm run build
```

## Prossimi sviluppi

1. verificare nel browser registrazione, email, login, refresh e logout con lo stack backend avviato;
2. riprovare CRUD spese, editing inline, inserimento entrate e aggiornamento della dashboard;
3. verificare isolamento fra utenti e comportamento sugli errori;
4. uniformare loading, conferme ed errori e ampliare i test mirati;
5. separare gli URL di sviluppo/produzione prima della pubblicazione integrata.

L'editing inline è già presente; il prossimo passo è verificarlo nel flusso completo, non ricostruirlo. La demo frontend non equivale a un backend pubblico disponibile.

## Versioning

Il progetto segue [Semantic Versioning](https://semver.org/):

- `0.x.y`: sviluppo attivo, API e funzionalità ancora soggette a cambiamenti;
- incremento `PATCH` (`0.3.1`) per correzioni compatibili;
- incremento `MINOR` (`0.4.0`) per nuove funzionalità durante lo sviluppo;
- `1.0.0` quando l'MVP sarà stabile, verificato e distribuibile.

## Autore

Fabio Zagaria — Junior Backend Developer con competenze full stack.
