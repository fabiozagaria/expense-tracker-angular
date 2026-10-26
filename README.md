# Gestionale Spese — Frontend Angular

![Versione](https://img.shields.io/badge/versione-1.0.0-blue)
![Stato](https://img.shields.io/badge/progetto-concluso-success)

**Progetto concluso al 25 ottobre 2026 — versione 1.0.0.**

Il perimetro funzionale è completato. Sono possibili correzioni di bug, refactoring e funzionalità future, gestite con nuove versioni. Non sono previste ulteriori funzionalità per chiudere questa versione.

Applicazione full stack per gestire spese ed entrate personali, con autenticazione, verifica email, dashboard e liste modificabili con ricerca, filtri e paginazione.

- [Applicazione online](https://gestionale-spese.vercel.app/)
- [Backend Spring Boot](https://github.com/fabiozagaria/expense-tracker-api)
- [Portfolio](https://fabio-zagaria-portfolio.vercel.app/)
- [GitHub di Fabio Zagaria](https://github.com/fabiozagaria)

## Funzionalità

- Registrazione con verifica email, login, rinnovo sessione e logout.
- Accesso rapido tramite **Prova la demo**, con account condiviso.
- Creazione, visualizzazione, modifica di tutti i campi ed eliminazione di spese ed entrate.
- Conferma prima dell'eliminazione e messaggi di caricamento, lista vuota ed errore.
- Liste paginate dal database, 10 movimenti per pagina.
- Filtro per mese/anno e ordine dalle più recenti o meno recenti.
- Ricerca per titolo/descrizione, importo esatto o data esatta.
- Dashboard con saldo, totali, ripartizione entrate/spese e ultimi sei movimenti.
- Collegamenti dalla dashboard al dettaglio spese e alla lista entrate.
- Tema chiaro/scuro, navigazione responsive e animazioni che rispettano il movimento ridotto.
- Footer con firma **fabiozagariadev**, portfolio e GitHub; favicon originale.

## Stack e struttura

Angular 21, TypeScript 5.9, Signals, Reactive Forms, HttpClient, RxJS, PrimeNG 21/Aura, PrimeIcons, GSAP e Vitest. Il progetto include configurazione SSR; le pagine sono caricate tramite route lazy. Il flusso di verifica email viene eseguito solo sul client.

| Percorso | Responsabilità |
| --- | --- |
| `src/app/core/layout/` | Header, navigazione e footer |
| `src/app/core/theme.service.ts` | Tema e preferenza locale |
| `src/app/core/ui/` | Direttiva condivisa per animazioni |
| `src/app/features/auth/` | Form auth, verifica email, sessione, guard e interceptor |
| `src/app/features/movements/` | Lista condivisa spese/entrate, modifica completa e client HTTP paginato |
| `src/app/features/expenses/` | Modelli, servizi, creazione e dettaglio delle spese; componenti dedicati |
| `src/app/features/income/` | Modelli, servizi e form di creazione entrate |
| `src/app/features/dashboard/` | Dashboard e composizione dei movimenti recenti |
| `src/app/features/transactions/` | Scelta tra nuova spesa e nuova entrata |
| `src/app/features/home/` | Pagina iniziale |
| `src/app/app.routes.ts` | Route, guard e titoli |
| `src/environments/` | URL backend locale e URL relativi production |
| `src/styles.css`, `codex/style.md` | Token, stili e convenzioni UI |
| `public/` | Asset statici e favicon |
| `vercel.json` | Proxy verso Render e intestazioni anti-cache |

I componenti gestiscono form e stato UI; i servizi dedicati incapsulano le chiamate HTTP. L'access token rimane in memoria, il refresh token in un cookie HttpOnly gestito dal backend.

## Route

| Route | Scopo | Autenticazione |
| --- | --- | --- |
| `/` | Home | Pubblica |
| `/login`, `/register` | Accesso e registrazione | Pubbliche |
| `/registrati` | Redirect a `/register` | Pubblica |
| `/verify-email?token=...` | Conferma email | Pubblica |
| `/dashboard` | Totali e ultimi movimenti | Richiesta |
| `/summary` | Lista paginata e modifica spese | Richiesta |
| `/incomes` | Lista paginata e modifica entrate | Richiesta |
| `/expenses/:id` | Dettaglio spesa | Richiesta |
| `/add-transaction` | Scelta movimento | Richiesta |
| `/add-expense`, `/add-income` | Creazione movimento | Richiesta |

## Integrazione REST

| Uso | Endpoint |
| --- | --- |
| Liste paginate | `GET /api/expenses/search`, `GET /api/incomes/search` |
| Creazione | `POST /api/expenses`, `POST /api/incomes` |
| Modifica completa dalle liste | `PUT /api/expenses/{id}`, `PUT /api/incomes/{id}` |
| Eliminazione | `DELETE /api/expenses/{id}`, `DELETE /api/incomes/{id}` |
| Dettaglio spesa | `GET /api/expenses/{id}` |
| Modifica parziale spese | `PATCH /api/expenses/{id}` nel client dedicato |
| Movimenti dashboard | `GET /api/expenses` e `GET /api/incomes`, risposta array |
| Totali dashboard | `GET /api/dashboard/summary` |
| Sessione | `POST /auth/register`, `/verify-email`, `/login`, `/refresh`, `/logout`, `/demo` |

Il backend espone inoltre dettaglio e PATCH delle entrate. Il [README API](https://github.com/fabiozagaria/expense-tracker-api#readme) è la fonte completa del contratto.

Le liste inviano `page` (da 0), `size=10`, `month=yyyy-MM`, `order=newest|oldest` e `query`. Il server restituisce `content`, `number`, `size`, `totalElements` e `totalPages`. La ricerca testuale è parziale su titolo e descrizione; importi e date sono esatti. Esempi: `25,50`, `25.50`, `2026-10-25` o `25/10/2026`.

La dashboard usa gli array completi e i totali dedicati: non calcola il saldo sulla sola pagina corrente. L'isolamento tra utenti è imposto dal backend.

L'interceptor aggiunge il Bearer alle API e gestisce il rinnovo su 401. Il guard tenta il ripristino della sessione dal cookie. Duplicati in registrazione e fallimenti dell'invio email mostrano messaggi dedicati; il login richiede email verificata.

## Deploy

| Componente | Ambiente |
| --- | --- |
| Frontend | Vercel: `https://gestionale-spese.vercel.app` |
| Backend | Render: `https://expense-tracker-api-demo-plb9.onrender.com` |
| Database | MySQL Aiven con TLS, accessibile solo dal backend |
| Email online | Brevo via HTTPS; SMTP/Mailpit in locale |

In produzione `apiBaseUrl` è vuoto: il browser usa URL relativi. `vercel.json` inoltra `/health`, `/auth/*` e `/api/*` a Render e imposta `Cache-Control: no-store` per questi percorsi. Il cookie refresh online è HttpOnly, Secure, SameSite=Strict, Path `/auth`; il backend verifica l'Origin delle POST auth nel profilo demo.

Il backend usa ancora il branch `demo/render-aiven-setup`, allineato al merge funzionale di `master` il 25 ottobre 2026; il suo Blueprint indica `master`. Registrazione pubblica e verifica email sono abilitate sul deploy.

**Prova la demo** usa un account condiviso: le modifiche sono visibili agli altri visitatori, quindi inserire solo dati fittizi. Banner DEMO e nota Account condiviso compaiono solo per quella sessione; gli account personali non mostrano questi avvisi. L'impostazione production `demo: true` non blocca il form di registrazione. Render può richiedere un'attesa al primo accesso dopo sospensione.

Prima della registrazione online, il client attende il risveglio del server tramite `GET /health`, con retry limitati a quattro minuti. Invia poi un solo `POST /auth/register`, con timeout di 15 secondi e senza retry automatici. Se la risposta del POST non arriva, la UI invita a controllare l'email prima di riprovare, perché l'account potrebbe essere stato creato. La conferma ricorda la validità del link di dieci minuti e il controllo della cartella Spam.

Dettagli e cronologia: [deploy](docs/DEPLOYMENT.md). Convenzioni UI: [style guide](codex/style.md).

## Avvio locale

Requisiti: Node.js `20.19+` nella linea 20, `22.12+` nella linea 22 oppure `24+`; npm e backend raggiungibile.

```bash
git clone https://github.com/fabiozagaria/expense-tracker-angular.git
cd expense-tracker-angular
npm ci
npm start
```

Frontend: `http://localhost:4200`. In sviluppo `apiBaseUrl=http://localhost:8080`.

Per avviare API, MySQL e Mailpit seguire il [README backend](https://github.com/fabiozagaria/expense-tracker-api#avvio-da-un-clone-pulito): compilare prima il suo `.env`, validare Compose e avviare lo stack. Il frontend va avviato separatamente. Le email locali sono consultabili in Mailpit su `http://localhost:8025`.

## Verifiche

```bash
npm test -- --watch=false
npm run build
```

Esiti del **25 ottobre 2026**:

- **62 test Angular passati**, inclusi auth, sessione demo/personale, gestione errori e nuove liste.
- **Build production riuscita**, con avvisi sui budget del bundle iniziale e CSS login/dashboard; budget non aumentati per nasconderli.
- **14 test backend passati** con Java 21 e MySQL 8.0.46 temporaneo, senza fallimenti/errori/skipped: autenticazione, CRUD, ricerca e isolamento tra utenti, oltre ai test mirati.
- Registrazione online con email reale e caricamento delle liste confermati dal proprietario.
- Deploy Vercel della correzione ai link entrate confermato.

I test non certificano tutti i casi limite né sostituiscono una verifica browser completa. Restano il controllo visivo sistematico desktop/mobile nei due temi e il percorso integrale nel browser locale con Angular e Mailpit. Queste verifiche non richiedono nuove funzionalità.

## Versioning e manutenzione

Prima versione funzionalmente conclusa: **1.0.0**, riferimento **25 ottobre 2026**. Versione allineata al backend nei rispettivi manifest.

- **PATCH** (`1.0.1`): correzioni compatibili e manutenzione/refactoring senza cambiare il contratto pubblico.
- **MINOR** (`1.1.0`): nuove funzionalità compatibili.
- **MAJOR** (`2.0.0`): modifiche incompatibili del contratto pubblico.

Il cambio dei manifest non crea automaticamente un tag Git o una GitHub Release.

## Autore

**Fabio Zagaria · fabiozagariadev** — Junior Backend Developer con competenze full stack.

[Portfolio](https://fabio-zagaria-portfolio.vercel.app/) · [GitHub](https://github.com/fabiozagaria)
