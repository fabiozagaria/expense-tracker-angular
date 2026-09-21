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

Il verticale delle spese è collegato alle API. Registrazione, verifica email, login, rinnovo della sessione e spese personali sono disponibili in locale con backend, MySQL e Mailpit avviati. La demo pubblica mostra l'interfaccia; le operazioni persistenti richiedono il backend. Dashboard, entrate e movimento generico restano fuori dalle route pubbliche.

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
- logout e protezione delle route delle spese.

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
| `authGuard`           | Protegge le rotte delle spese e ripristina la sessione dal cookie          |

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

L'autenticazione locale usa `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/login`, `POST /auth/refresh` e `POST /auth/logout`. Il backend restituisce l'access token nel corpo del login/refresh e conserva il refresh token in un cookie HttpOnly. Il frontend invia il cookie con `withCredentials` e protegge le rotte `/summary`, `/add-expense` e `/expenses/:id`.

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
Per provare la registrazione serve anche Mailpit (`docker compose up -d` nel repository backend); il link di verifica è visibile su `http://localhost:8025`. L'integrazione API è configurata per `http://localhost:8080` e richiede il frontend su `http://localhost:4200`.

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
6. verificare manualmente il flusso completo nel browser e configurare gli URL per gli ambienti pubblici;
7. introdurre successivamente entrate e dashboard.

## Versioning

Il progetto segue [Semantic Versioning](https://semver.org/):

- `0.x.y`: sviluppo attivo, API e funzionalità ancora soggette a cambiamenti;
- incremento `PATCH` (`0.3.1`) per correzioni compatibili;
- incremento `MINOR` (`0.4.0`) per nuove funzionalità durante lo sviluppo;
- `1.0.0` quando l'MVP sarà stabile, verificato e distribuibile.

## Autore

Fabio Zagaria — Junior Backend Developer con competenze full stack.
