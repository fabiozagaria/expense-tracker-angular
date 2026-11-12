# Demo portfolio: Render + Aiven + Vercel

## Stato corrente — 12 novembre 2026

**Versione corrente 1.2.0** (backend compatibile 1.2.0). Questa sezione e il README descrivono lo stato attuale; le note successive conservano la cronologia e possono descrivere stati superati.

- **Servizio online sospeso dal 12 novembre 2026.** Il database MySQL Aiven della demo risulta spento e il provider ha ritirato il piano gratuito (nessuna nuova istanza free dal 6 novembre; cancellazione di quelle rimaste il 21 dicembre 2026, secondo la documentazione Aiven letta tramite ricerca, non verificata sulle pagine ufficiali). L'istanza Render va in crash loop all'avvio (`UnknownHostException` sul DNS del database, Flyway non si connette). Il codice non è interessato: il commit solo documentale `d4e5aca` del backend è identico al `40dbcc7` andato online il 10 novembre. Il frontend mostra un avviso fisso (`environment.maintenance` in `environment.production.ts`, componente `MaintenanceBanner`), disabilita «Prova la demo» e non aspetta più il risveglio del server. Ripristino previsto dal proprietario entro 24–48 ore; al ripristino mettere `maintenance: false` e rimuovere gli avvisi dai README.
- Frontend Vercel e backend Render con MySQL Aiven/TLS; registrazione online e Brevo HTTPS attivi fino al 10 novembre 2026.
- Client allineato al contratto REST del backend: CRUD e ricerca di spese/entrate, dettaglio di entrambe, recupero password (`/forgot-password`, `/reset-password`), nuovo link di verifica (`/resend-verification`), messaggi `429 RATE_LIMITED`, password fino a 72 byte UTF-8.
- Pagina Impostazioni (`/settings`, solo utenti loggati, voce nel menu): username ed email da `GET /api/me`, invio del link per cambiare la password con l'email del profilo (riuso di `forgot-password` e `/reset-password`). Sull'account demo condiviso (email `portfolio-demo@example.invalid`, non raggiungibile) la scheda Password mostra solo una nota.
- Frontend: 106 test e build production riusciti; restano gli avvisi di budget su bundle iniziale e CSS login/dashboard.
- Il percorso reale Impostazioni → email → nuova password → login è stato provato dal proprietario sul sito pubblico il 10 novembre 2026 con un'email vera e funziona: sono quindi online sia il frontend 1.2.0 sia il backend 1.2.0. Il frontend 1.2.0 richiede il backend 1.2.0, per `/api/me`.
- Manifest a 1.2.0. Tag Git `v1.1.0` e `v1.2.0` e relative release da creare a mano: la sessione non riesce a pubblicare tag.
- Il proprietario ha dichiarato il progetto concluso (10 novembre 2026). Unica idea futura, rinviata e a suo carico: eliminazione dell'account (vedi `FUTURE.md`).

## Cronologia e dettagli tecnici

Preparazione del codice; pubblicazione e verifica nel browser ancora da completare.

## Backend

1. Creare un database Aiven MySQL sul piano Free, verificando disponibilità e limiti nell'account. Usare un database dedicato alla demo, senza dati personali.
2. Configurare il certificato CA pubblico fornito da Aiven nella variabile Render `AIVEN_CA_CERT`, oppure come secret file `aiven-ca.pem` (montato in `/etc/secrets/aiven-ca.pem`). L'entrypoint crea un truststore temporaneo; Connector/J verifica CA e hostname con `VERIFY_IDENTITY`.
3. Il Blueprint `render.yaml` usa soltanto un web service Docker Free. Impostare `DB_URL` nel formato `jdbc:mysql://HOST:PORT/defaultdb` (senza parametri che disabilitano TLS), `DB_USERNAME` e `DB_PASSWORD`. Render genera `SECRET_KEY` e `DEMO_PASSWORD`. Non copiare i segreti nel repository.
4. Il profilo `demo` disabilita la registrazione e crea un account USER verificato e dati fittizi solo alla prima inizializzazione. Ai riavvii aggiorna la password demo ma conserva i dati. Non usare questo profilo su un database personale o di produzione.
5. `GET /health` indica che il processo HTTP è avviato; non certifica la disponibilità del database. Controllare anche un login demo e una lettura dati.

## Frontend

La build production usa URL relativi. `vercel.json` inoltra `/auth/*` e `/api/*` al backend Render; entrambe le destinazioni devono usare l'URL realmente assegnato al servizio. Il servizio Render creato usa `https://expense-tracker-api-demo-plb9.onrender.com`; le rewrites sono aggiornate a questo URL.

Il cookie resta HttpOnly, Secure e SameSite=Strict, senza Domain, con Path=/auth. Non aggiungere un prefisso diverso al proxy senza aggiornare anche il Path del cookie. Le risposte API non devono essere memorizzate nella CDN. Verificare che Vercel inoltri Origin, Cookie e Set-Cookie.

`FRONTEND_URL` deve essere esattamente `https://gestionale-spese.vercel.app`, senza slash finale. Nel profilo demo tutte le POST /auth richiedono questa Origin: protegge anche refresh, logout e login da richieste cross-site. Le preview Vercel non sono automaticamente autorizzate.

La demo usa un account condiviso: visitatori diversi possono cambiare gli stessi dati. Il pulsante non espone la password; avvia il normale flusso JWT/refresh. Non inserire dati personali. Non è previsto un reset automatico né una difesa completa contro abuso/quote: se necessario sospendere la demo o aggiungere limiti mirati.

## Email

In locale resta SMTP/Mailpit. La demo non invia email e blocca la registrazione. La futura integrazione HTTPS richiede un provider e un mittente verificato; non basta cambiare host o porta SMTP.

## Verifica prima della pubblicazione

- Test backend con MySQL e test Angular, più build production.
- Render avviato senza errori, TLS MySQL verificato e nome pubblico corretto nelle rewrites.
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
