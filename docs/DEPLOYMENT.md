# Demo portfolio: Render + Vercel

## Stato corrente — 19 novembre 2026

**Versione corrente 1.2.0** (backend compatibile 1.2.0 o successivo; online il backend 1.3.0). Questa sezione e il README descrivono lo stato attuale; le note successive conservano la cronologia e possono descrivere stati superati.

- **Backend migrato a PostgreSQL il 19 novembre 2026** (PR del backend `expense-tracker-api`), per usare Neon sul piano gratuito: il profilo `demo,neon` rende persistenti i dati della demo. Il backend 1.3.0 (tag `v1.3.0`) rilascia questo passaggio e la demo online usa `demo,neon`: il 19 novembre 2026 un login demo sul backend pubblico ha scritto il refresh token nel database Neon. Il frontend non cambia: il contratto REST è identico. Unica differenza visibile: username ed email restano senza distinzione tra maiuscole e minuscole, come con MySQL.
- **Demo online ripristinata il 15 novembre 2026, con un database H2 in memoria (fino al passaggio a Neon del 19 novembre).** Il 12 novembre il database MySQL Aiven della demo si era spento (piano gratuito ritirato) e il sito ha mostrato un avviso fisso di sospensione con accesso e registrazione disabilitati. Il backend 1.2.0 ora usa il profilo `demo` su H2 (nessun database esterno, nessun costo): l'account condiviso e i dati di esempio vengono ricreati a ogni avvio, i dati aggiunti dai visitatori si perdono al riavvio e la registrazione è chiusa. Verificati sul backend live: `/health`, login demo, `/api/me`, dashboard, ricerca di spese ed entrate e registrazione chiusa (503). `environment.maintenance` è tornato `false` (il componente `MaintenanceBanner` resta per eventuali emergenze).
- Frontend Vercel e backend Render; il database MySQL Aiven non è più usato dalla demo online (oggi PostgreSQL su Neon col profilo `neon`; dal 15 al 19 novembre 2026 H2 in memoria).
- Client allineato al contratto REST del backend: CRUD e ricerca di spese/entrate, dettaglio di entrambe, recupero password (`/forgot-password`, `/reset-password`), nuovo link di verifica (`/resend-verification`), messaggi `429 RATE_LIMITED`, password fino a 72 byte UTF-8.
- Pagina Impostazioni (`/settings`, solo utenti loggati, voce nel menu): username ed email da `GET /api/me`, invio del link per cambiare la password con l'email del profilo (riuso di `forgot-password` e `/reset-password`). Sull'account demo condiviso (email `portfolio-demo@example.invalid`, non raggiungibile) la scheda Password mostra solo una nota.
- Frontend: 120 test passati (27 file) il 17 novembre 2026, con `ng test --watch=false`. La build production e gli avvisi di budget su bundle iniziale e CSS login/dashboard non sono stati rieseguiti in quella verifica; l'ultima dichiarazione era «109 test e build riusciti» (15 novembre).
- Il percorso reale Impostazioni → email → nuova password → login è stato provato dal proprietario sul sito pubblico il 10 novembre 2026 con un'email vera e funziona: sono quindi online sia il frontend 1.2.0 sia il backend 1.2.0. Il frontend 1.2.0 richiede il backend 1.2.0, per `/api/me`.
- Manifest a 1.2.0. Il 19 novembre 2026 il proprietario ha pubblicato da GitHub il tag `v1.2.0` sul commit `b323981` (rilascio del 10 novembre) con la sua GitHub Release; gli sviluppi successivi (avviso di manutenzione, skeleton e spinner) restano per una futura versione. Tag e release si creano a mano: le sessioni cloud non riescono a pubblicare tag. Il backend è a `v1.3.0`.
- Il proprietario ha dichiarato il progetto concluso (10 novembre 2026). Unica idea futura, rinviata e a suo carico: eliminazione dell'account (vedi `FUTURE.md`).

## Cronologia e dettagli tecnici

Preparazione del codice; pubblicazione e verifica nel browser ancora da completare.

## Backend

1. Il database e la sua configurazione sono documentati nel backend: [DEPLOYMENT del backend](https://github.com/fabiozagaria/expense-tracker-api/blob/master/docs/DEPLOYMENT.md). Dal 19 novembre 2026 il backend usa PostgreSQL: H2 in memoria col profilo `demo`, Neon (piano Free) col profilo `demo,neon`, che è quello attivo sulla demo online. Aiven MySQL non è più usato.
2. Il Blueprint `render.yaml` del backend usa un web service Docker Free. Render genera `SECRET_KEY` e `DEMO_PASSWORD`. Non copiare i segreti nel repository.
3. Il profilo `demo` crea un account USER verificato con dati fittizi; con Neon i dati restano tra un riavvio e l'altro. Non usare questo profilo su un database personale o di produzione.
4. `GET /health` indica che il processo HTTP è avviato; non certifica la disponibilità del database. Controllare anche un login demo e una lettura dati.

## Frontend

La build production usa URL relativi. `vercel.json` inoltra `/auth/*` e `/api/*` al backend Render; entrambe le destinazioni devono usare l'URL realmente assegnato al servizio. Il servizio Render creato usa `https://expense-tracker-api-demo-plb9.onrender.com`; le rewrites sono aggiornate a questo URL.

Il cookie resta HttpOnly, Secure e SameSite=Strict, senza Domain, con Path=/auth. Non aggiungere un prefisso diverso al proxy senza aggiornare anche il Path del cookie. Le risposte API non devono essere memorizzate nella CDN. Verificare che Vercel inoltri Origin, Cookie e Set-Cookie.

`FRONTEND_URL` deve essere esattamente `https://gestionale-spese.vercel.app`, senza slash finale. Nel profilo demo tutte le POST /auth richiedono questa Origin: protegge anche refresh, logout e login da richieste cross-site. Le preview Vercel non sono automaticamente autorizzate.

La demo usa un account condiviso: visitatori diversi possono cambiare gli stessi dati. Il pulsante non espone la password; avvia il normale flusso JWT/refresh. Non inserire dati personali. Non è previsto un reset automatico né una difesa completa contro abuso/quote: se necessario sospendere la demo o aggiungere limiti mirati.

## Email

In locale resta SMTP/Mailpit. La demo non invia email e blocca la registrazione. La futura integrazione HTTPS richiede un provider e un mittente verificato; non basta cambiare host o porta SMTP.

## Verifica prima della pubblicazione

- Test backend con PostgreSQL (Testcontainers) e test Angular, più build production.
- Render avviato senza errori, TLS verso il database verificato e nome pubblico corretto nelle rewrites.
- Nel browser: Prova la demo, elenco/modifica/eliminazione spese, inserimento entrate, riepilogo.
- Reload pagina, refresh dopo scadenza JWT, logout, riutilizzo del refresh revocato.
- POST auth da origine non autorizzata o senza Origin rifiutata; /users e altri repository non esposti tramite Spring Data REST.
- Primo accesso dopo sospensione: messaggio di attesa, nessun retry automatico dei POST; se il proxy scade prima del risveglio riprovare manualmente.
- Controllare le condizioni gratuite e le eventuali sospensioni del database; nessun pagamento o keep-alive artificiale è previsto.

## Verifiche locali eseguite

2026-10-12: 5 test backend passati con MySQL 8.4 temporaneo; 25 test Angular passati e build production riuscita (warning sul budget iniziale già superiore a 500 kB). TLS Aiven e proxy Vercel richiedono la prova con le risorse pubbliche.

## Servizio Render creato

Servizio `expense-tracker-api-demo`, piano Free, regione Frankfurt, branch `demo/render-aiven-setup`. Certificato e variabili configurati; `DB_PASSWORD` inserita dal proprietario. Deploy Render live e API verificate. Pubblicazione del frontend in corso.

## Verifica backend pubblico — 2026-10-12

Deploy Render `dep-db6g54ad0e5s73akjl20` live. `/health`, login demo, lettura spese/entrate/dashboard e refresh restituiscono 200; logout restituisce 204 e il refresh dopo logout 401. Cookie HttpOnly, Secure, SameSite=Strict e Path=/auth verificati. Connessione MySQL riuscita con la configurazione VERIFY_IDENTITY e il certificato Aiven. Avvio dell'app circa 143 secondi su Render Free; la UI deve considerare 2–3 minuti.

## Pagina registrazione — 2026-10-12

`/register` espone un form ReactiveForms con username, email e password; `/registrati` è un alias. Il form locale usa POST /auth/register e il flusso di verifica email. Nella demo pubblica i campi sono visibili, ma il submit è bloccato finché non viene configurato un provider email adatto al deploy. Nessuna verifica email viene simulata. Gestiti i conflitti di username/email con errorName specifico e HTTP 409. 44 test Angular passati e build production riuscita; 7 test backend con MySQL passati.

## Verifica deploy registrazione — 2026-10-25

Backend Render live: deploy `dep-dbf1v8ek1f9s73fptho0`, commit `76fec7db0f4f86fb9764ca087836e12df7c094c7`. Il servizio segue ancora `demo/render-aiven-setup`, avanzato senza force dal vecchio commit alla versione integrata in master. Profilo demo conservato; MAIL_PROVIDER=brevo e REGISTRATION_ENABLED=true configurati su Render preservando i segreti esistenti.

Verifiche completate: 3 test Brevo con Java 21 passati; 56 test Angular passati e build production riuscita con gli avvisi sui budget già presenti. Browser pubblico /register: pulsante Registrati abilitato. API pubblica: health 200, username portfolio-demo già esistente respinto con 409 USERNAME_ALREADY_EXISTS (anche tramite proxy Vercel), token verifica inesistente 400, accesso anonimo alle spese 401, login demo 200 e lettura spese autenticata 200. La prova del duplicato non crea utenti e non invia email.

Resta da verificare con un indirizzo reale: registrazione nuova, accettazione/consegna Brevo, ricezione del link, conferma e login del nuovo account. Nessuna email reale inviata durante questi controlli. Le precedenti note su test non eseguibili sono superate per i test mirati citati; non è stata rieseguita l'intera suite backend con MySQL.

## Registrazione e risveglio Render — 2026-10-26

La registrazione pubblica resta attiva e separata dall'accesso demo condiviso, come documentato nello stato corrente del README. Le note del 12 ottobre sul form bloccato descrivono lo stato storico precedente.

In produzione (`demo: true`) la registrazione attende `GET /health`, con timeout di 15 secondi per richiesta e retry fino a quattro minuti. Dopo una risposta `{ "status": "up" }`, il client invia un solo `POST /auth/register` con timeout di 15 secondi. Nessun errore del POST o del servizio email viene ritentato automaticamente. In locale la registrazione invia direttamente il POST.

HTTP 503 `EMAIL_DELIVERY_FAILED` mantiene il contratto del backend attuale: l'invio email fallisce e la registrazione viene annullata. La UI conserva il form e non espone dettagli del provider. Se invece manca la risposta del POST, non è possibile dedurre se l'account sia stato creato: controllare l'email prima di riprovare. Dopo il successo, il messaggio ricorda il link valido dieci minuti e la cartella Spam.

Non è stato introdotto un nuovo flag frontend per disabilitare la registrazione. Il backend mantiene il controllo `REGISTRATION_ENABLED`; il provider, i segreti, gli URL e la configurazione del deploy non sono stati modificati da questa integrazione.
