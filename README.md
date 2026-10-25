# Gestionale Spese — Frontend Angular

![Versione](https://img.shields.io/badge/versione-0.3.0-blue)
![Stato](https://img.shields.io/badge/stato-in%20sviluppo-orange)

**Versione attuale: 0.3.0 — applicazione full stack in consolidamento.**

Frontend del progetto full stack **Gestionale Spese**, con spese personali, inserimento entrate e dashboard.

L'applicazione è sviluppata con Angular e comunica tramite API REST con un backend Spring Boot mantenuto in un repository separato.

- [Demo frontend](https://gestionale-spese.vercel.app/)
- [Repository backend](https://github.com/fabiozagaria/expense-tracker-api)

## Interfaccia PrimeNG/Aura

Tutte le pagine e i componenti usano PrimeNG 21, Aura e PrimeIcons: home, dashboard, login, registrazione, verifica email, scelta movimento, form spesa/entrata, elenco, card e dettaglio spese. Bootstrap è stato rimosso dalle dipendenze, dagli stili e dagli script. Colori, spaziatura, form e messaggi seguono [codex/style.md](codex/style.md), con tema chiaro/scuro, layout responsive e animazioni GSAP che rispettano il movimento ridotto. Tutte le pagine sono caricate al bisogno.

La favicon originale riprende un portafoglio stilizzato nei colori verde petrolio, avorio e smeraldo. È distribuita come [PNG 64×64](public/gestore-spese-icon.png), con [fallback ICO](public/favicon.ico) a 16, 32, 48 e 64 pixel.

## Stato del progetto

**Demo full stack pubblica; consolidamento e verifiche dei casi limite ancora aperti.**

L'applicazione è online su Vercel, collegata al backend Spring Boot su Render e al database MySQL Aiven. Registrazione pubblica e invio dell'email di verifica tramite Brevo HTTPS sono attivi; il proprietario ha confermato la registrazione reale il 25 ottobre 2026. In locale resta disponibile SMTP/Mailpit.

Il pulsante **Prova la demo** usa un account condiviso con dati fittizi. Il banner **DEMO** e la nota **Account condiviso** compaiono soltanto per quella sessione, anche dopo il rinnovo del token; gli account personali non ricevono questi avvisi. Il riconoscimento nel client serve soltanto alla presentazione: autenticazione e isolamento dei dati sono gestiti dal backend.

Login demo, sessione, dashboard e CRUD spese sono stati verificati nel browser. Restano aperte le regressioni dei casi limite e le prove dedicate alla creazione di entrate sul database condiviso.

## Scopo e confine della versione

Client Angular del prodotto full stack Expense Tracker: integra UI, form, chiamate REST e autenticazione con il backend. La demo pubblica integra autenticazione, spese, entrate e riepilogo. Il lavoro residuo riguarda prove riproducibili dei casi limite, registrazione locale con verifica email e copertura dei test; nuove funzionalità richiedono una scelta di scope separata.

## Funzionalità presenti

- navigazione tra home, elenco spese, aggiunta e dettaglio;
- form reattivo per l'inserimento delle spese;
- validazione di titolo, importo, categoria, descrizione e data;
- stato applicativo gestito con Angular Signals;
- caricamento dell'elenco delle spese tramite API;
- aggiunta, modifica e rimozione di una spesa;
- pagina di riepilogo e route di dettaglio;
- gestione iniziale degli stati di caricamento ed errore;
- client HTTP tipizzato per le operazioni REST previste;
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
- PrimeNG 21, Aura e PrimeIcons
- GSAP
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

L'autenticazione usa `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/login`, `POST /auth/refresh` e `POST /auth/logout`. Il backend restituisce l'access token nel corpo del login/refresh e conserva il refresh token in un cookie HttpOnly. Il frontend invia il cookie con `withCredentials` e protegge le rotte `/summary`, `/add-expense`, `/expenses/:id`, `/dashboard`, `/add-income` e `/add-transaction`.

La pagina canonica di registrazione è `/register`; `/registrati` reindirizza alla stessa pagina. Il form valida username, email e password e invia il DTO a `POST /auth/register` anche online. Dopo il successo richiede la verifica email prima del login. Le risposte `409` con `errorName` `USERNAME_ALREADY_EXISTS` o `EMAIL_ALREADY_EXISTS` mostrano quale campo è già registrato. Il form non è più bloccato dalla modalità demo. Il backend controlla l'abilitazione e invia con Brevo HTTPS; `503 EMAIL_DELIVERY_FAILED` mostra un errore specifico e consente di riprovare.

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

Verifiche del 25 ottobre 2026: **60 test Angular passati** e build production riuscita. Restano gli avvisi sui budget del bundle iniziale e dei CSS di login/dashboard, senza errori bloccanti. I test includono registrazione online, errori di invio email e distinzione fra account personale e demo con ripristino dopo refresh. La registrazione con email reale è stata confermata dal proprietario; non equivale a una copertura completa dei casi limite.

```bash
npm test
npm run build
```

## Prossimi sviluppi

1. completare la verifica della registrazione locale e della verifica email con backend e Mailpit;
2. ampliare le prove di regressione del CRUD spese, dell'editing inline e della creazione di entrate con aggiornamento dashboard;
3. verificare isolamento fra utenti e comportamento sugli errori;
4. uniformare loading, conferme ed errori e ampliare i test mirati;
5. ampliare le prove dei casi limite della registrazione e della verifica email.

L'editing inline è già presente; restano da ampliare le prove dei casi limite. Il sito pubblico usa il backend Render; registrazione online e invio email Brevo sono attivi.

## Versioning

Il progetto segue [Semantic Versioning](https://semver.org/):

- `0.x.y`: sviluppo attivo, API e funzionalità ancora soggette a cambiamenti;
- incremento `PATCH` (`0.3.1`) per correzioni compatibili;
- incremento `MINOR` (`0.4.0`) per nuove funzionalità durante lo sviluppo;
- `1.0.0` quando l'MVP sarà stabile, verificato e distribuibile.

## Autore

Fabio Zagaria — Junior Backend Developer con competenze full stack.

## Tema della pagina

Il pulsante sole/luna nella navigazione alterna tema chiaro e scuro. Al primo accesso segue il dispositivo; la scelta manuale viene ricordata nel browser.


## Demo pubblica

Frontend Vercel e backend Render sono online: vedere [deploy e verifiche](docs/DEPLOYMENT.md). **Prova la demo** apre l'account condiviso; le modifiche sono visibili agli altri visitatori. Usare solo dati fittizi. Gli account personali possono registrarsi online e confermare l'email inviata tramite Brevo HTTPS. In locale resta SMTP/Mailpit. Il banner DEMO identifica soltanto la sessione condivisa, non l'intero sito.
