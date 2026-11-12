# Gestionale Spese — Frontend Angular

![Versione](https://img.shields.io/badge/versione-1.2.0-blue)
![Stato](https://img.shields.io/badge/progetto-concluso-success)
![Demo](https://img.shields.io/badge/demo_online-sospesa-orange)

> [!WARNING]
> **Demo online sospesa (aggiornamento del 12 novembre 2026).** Il database MySQL della demo, ospitato su Aiven, non è più disponibile perché il provider ha ritirato il piano gratuito. Accesso, registrazione e dati online non funzionano e il sito mostra un avviso fisso. Il ripristino è previsto entro 24–48 ore; se cambia, questo avviso viene aggiornato. Il codice del progetto non è interessato e resta avviabile in locale (vedi [Avvio locale](#avvio-locale)).

**Versione frontend corrente: 1.2.0 — aggiornamento del 10 novembre 2026.**

Backend compatibile: **1.2.0**. La minor 1.2.0 aggiunge la pagina Impostazioni per l'utente loggato: dati dell'account e link per cambiare la password, senza riscrivere l'email (usa il nuovo `GET /api/me` del backend). La minor 1.1.0 allinea il client al contratto REST del backend: recupero password, nuovo invio del link di verifica, dettaglio delle entrate, limiti della password come sul server e messaggi per il limite di richieste.

Il perimetro funzionale è completato. Sono possibili correzioni di bug, refactoring e funzionalità future, gestite con nuove versioni. Non sono previste ulteriori funzionalità per chiudere questa versione.

Applicazione full stack per gestire spese ed entrate personali, con autenticazione, verifica email, dashboard e liste modificabili con ricerca, filtri e paginazione.

- [Applicazione online](https://gestionale-spese.vercel.app/)
- [Backend Spring Boot](https://github.com/fabiozagaria/expense-tracker-api)
- [Portfolio](https://fabio-zagaria-portfolio.vercel.app/)
- [GitHub di Fabio Zagaria](https://github.com/fabiozagaria)

## Funzionalità

- Registrazione con verifica email, nuovo invio del link di verifica, login, rinnovo sessione e logout.
- Password dimenticata: richiesta del link via email e scelta della nuova password.
- Accesso rapido tramite **Prova la demo**, con account condiviso.
- Creazione, visualizzazione, modifica di tutti i campi ed eliminazione di spese ed entrate.
- Conferma prima dell'eliminazione e messaggi di caricamento, lista vuota ed errore.
- Liste paginate dal database, 10 movimenti per pagina.
- Filtro per mese/anno e ordine dalle più recenti o meno recenti.
- Ricerca per titolo/descrizione, importo esatto o data esatta.
- Dashboard con saldo, totali, ripartizione entrate/spese e ultimi sei movimenti.
- Dettaglio di spese ed entrate, raggiungibile dalla dashboard e dalle liste.
- Impostazioni (`/settings`): username ed email dell'account e invio del link per cambiare la password; sull'account demo condiviso la scheda Password è solo una nota.
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
| `/resend-verification` | Nuovo link di verifica | Pubblica |
| `/forgot-password` | Richiesta link di reimpostazione | Pubblica |
| `/reset-password?token=...` | Nuova password (link dell'email) | Pubblica |
| `/dashboard` | Totali e ultimi movimenti | Richiesta |
| `/summary` | Lista paginata e modifica spese | Richiesta |
| `/incomes` | Lista paginata e modifica entrate | Richiesta |
| `/expenses/:id`, `/incomes/:id` | Dettaglio spesa o entrata | Richiesta |
| `/settings` | Dati dell'account e cambio password via email | Richiesta |
| `/add-transaction` | Scelta movimento | Richiesta |
| `/add-expense`, `/add-income` | Creazione movimento | Richiesta |

## Integrazione REST

| Uso | Endpoint |
| --- | --- |
| Liste paginate | `GET /api/expenses/search`, `GET /api/incomes/search` |
| Creazione | `POST /api/expenses`, `POST /api/incomes` |
| Modifica completa dalle liste | `PUT /api/expenses/{id}`, `PUT /api/incomes/{id}` |
| Eliminazione | `DELETE /api/expenses/{id}`, `DELETE /api/incomes/{id}` |
| Dettaglio | `GET /api/expenses/{id}`, `GET /api/incomes/{id}` |
| Modifica parziale spese | `PATCH /api/expenses/{id}` nel client dedicato |
| Movimenti dashboard | `GET /api/expenses/search?page=0&size=10` e `GET /api/incomes/search?page=0&size=10` |
| Totali dashboard | `GET /api/dashboard/summary` |
| Sessione | `POST /auth/register`, `/verify-email`, `/login`, `/refresh`, `/logout`, `/demo` |
| Recupero account | `POST /auth/resend-verification`, `/forgot-password`, `/reset-password` |
| Profilo | `GET /api/me` (username ed email dell'utente del token) |

Il backend espone inoltre il PATCH delle entrate e gli elenchi completi `GET /api/{expenses,incomes}` (massimo 1000 elementi), non usati dal client. Il [README API](https://github.com/fabiozagaria/expense-tracker-api#readme) è la fonte completa del contratto.

Le liste inviano `page` (da 0), `size=10`, `month=yyyy-MM`, `order=newest|oldest` e `query`. Il server restituisce `content`, `number`, `size`, `totalElements` e `totalPages`. La ricerca testuale è parziale su titolo e descrizione; importi e date sono esatti. Esempi: `25,50`, `25.50`, `2026-10-25` o `25/10/2026`.

La dashboard usa la prima pagina della ricerca per spese ed entrate e i totali dedicati: non calcola il saldo sulla sola pagina corrente. L'isolamento tra utenti è imposto dal backend.

L'interceptor aggiunge il Bearer alle API e gestisce il rinnovo su 401. Il guard tenta il ripristino della sessione dal cookie. Gli errori seguono il formato `APIError` del backend (`errorName`, `details`, ...): duplicati in registrazione, invio email fallito, email non verificata (con link al nuovo invio), link di reset non valido e limite di richieste `429 RATE_LIMITED` (attesa letta da `Retry-After`) mostrano messaggi dedicati. I form replicano i vincoli dei DTO, inclusa la password fino a 72 byte UTF-8 e i titoli non composti solo da spazi.

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

Esiti del **10 novembre 2026** (versione 1.2.0):

- **96 test Angular passati**, inclusi pagina Impostazioni (profilo, invio del link, account demo, errore di caricamento, 429, consegna email fallita, avviso di avvio del server) e servizio del profilo.
- **Build production riuscita**, con gli stessi avvisi di budget.
- Pagina `/settings` nel browser sulla build di produzione, con risposte del backend simulate: desktop chiaro, mobile scuro con email molto lunga, invio riuscito, attesa del server, account demo e errore di caricamento, senza overflow né errori JavaScript.
- **Backend 1.2.0:** 122 test passati in locale con Java 21 e MySQL 8.0 Testcontainers.
- **Prova reale sul sito pubblico (10 novembre 2026), confermata dal proprietario:** Impostazioni, invio del link con un'email reale, scelta della nuova password e login. Il percorso funziona.

Esiti del **10 novembre 2026** (versione 1.1.0):

- **87 test Angular passati**, inclusi recupero password, nuovo link di verifica, messaggi 429, dettaglio movimenti e validatori allineati ai DTO.
- **Build production riuscita**, con avvisi sui budget del bundle iniziale e CSS login/dashboard; budget non aumentati per nasconderli.
- Percorsi nel browser sulla build di produzione, con risposte del backend simulate: login con email non verificata, 429, password dimenticata, reset (token usato, password diverse, riuscito), registrazione con password lunga, dashboard e dettaglio entrata. Nessun errore JavaScript.
- **CI del backend 1.1.0 verde** su GitHub Actions.

Esiti del **25 ottobre 2026**:

- **62 test Angular passati**, inclusi auth, sessione demo/personale, gestione errori e nuove liste.
- **14 test backend passati** con Java 21 e MySQL 8.0.46 temporaneo, senza fallimenti/errori/skipped: autenticazione, CRUD, ricerca e isolamento tra utenti, oltre ai test mirati.
- Registrazione online con email reale e caricamento delle liste confermati dal proprietario.
- Deploy Vercel della correzione ai link entrate confermato.

I test non certificano tutti i casi limite né sostituiscono una verifica browser completa. Restano il controllo visivo sistematico desktop/mobile nei due temi, il percorso integrale nel browser locale con Angular e Mailpit (la prova reale del reset password con email vera è stata confermata dal proprietario il 10 novembre 2026). Queste verifiche non richiedono nuove funzionalità.

## Versioning e manutenzione

Prima versione funzionalmente conclusa: **1.0.0**, riferimento **25 ottobre 2026**. Versioni correnti: frontend **1.1.0**, backend **1.1.0**.

- **PATCH** (`1.0.1`): correzioni compatibili e manutenzione/refactoring senza cambiare il contratto pubblico.
- **MINOR** (`1.1.0`): nuove funzionalità compatibili.
- **MAJOR** (`2.0.0`): modifiche incompatibili del contratto pubblico.

Il cambio dei manifest non crea automaticamente un tag Git o una GitHub Release.

## Autore

**Fabio Zagaria · fabiozagariadev** — Junior Backend Developer con competenze full stack.

[Portfolio](https://fabio-zagaria-portfolio.vercel.app/) · [GitHub](https://github.com/fabiozagaria)
