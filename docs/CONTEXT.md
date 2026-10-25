# Contesto tecnico — Gestionale Spese Frontend

## Stato corrente — 25 ottobre 2026

**Progetto concluso, versione 1.0.0**, salvo correzioni di bug, refactoring e funzionalità future. Questa sezione e il README descrivono lo stato attuale; le note successive conservano la cronologia e possono descrivere stati superati.

- Frontend Vercel e backend Render con MySQL Aiven/TLS; registrazione online e Brevo HTTPS attivi. Registrazione reale e caricamento liste confermati dal proprietario.
- CRUD completo spese/entrate e liste /api/{expenses,incomes}/search con paginazione, mese/anno, ordine data/ID e ricerca titolo/descrizione/importo/data.
- Render esistente segue demo/render-aiven-setup, allineato al merge funzionale di master; render.yaml indica master. Aggiornare master non certifica da solo il deploy di quel servizio.
- Suite backend completa: 14 test passati con Java 21.0.13 e MySQL 8.0.46 temporaneo, zero fallimenti/errori/skipped. Nessun dato online utilizzato.
- Frontend: 62 test e build production riusciti; avvisi sui budget iniziale e CSS login/dashboard. Correzione link entrate dalla dashboard pubblicata su Vercel.
- Restano il controllo visivo sistematico desktop/mobile e temi, il percorso integrale nel browser locale con Mailpit e la verifica completa del Compose originale senza i precedenti problemi del proxy TLS.
- Versioni dei manifest allineate a 1.0.0. Nessun tag Git o GitHub Release creato da questo aggiornamento.

## Cronologia e dettagli tecnici

Aggiornato: 2026-10-12

## Obiettivo corrente
Completare e verificare localmente il verticale registrazione → verifica email → login → spese personali → refresh/logout.

## Stato osservato
- Versione dichiarata: 0.3.0.
- Angular 21, TypeScript 5.9, Signals, Reactive Forms, HttpClient e RxJS.
- CRUD Expense collegato al backend: GET, POST, PATCH e DELETE verificati manualmente end-to-end con persistenza MySQL.
- Editing inline convertito a un unico `FormGroup`: rimossi i signal duplicati, submit invalido bloccato, valori letti con `getRawValue()`.
- Salvataggio editing gestito tramite `(ngSubmit)` sul form; il bottone `Salva` resta `type="submit"`.
- PATCH verificato anche nel caso descrizione con testo → stringa vuota; la lista si aggiorna dalla risposta del backend.
- Deploy Vercel del commit frontend finale verificato con stato `success`.
- Backend separato nel repository `expense-tracker-api`.
- Pagina Angular `/verify-email?token=...` con client HTTP dedicato verso `POST /auth/verify-email`; stati UI espliciti per caricamento, successo, token assente ed errore.
- La pagina di verifica è renderizzata solo sul client e il `POST` non parte durante SSR, evitando di consumare due volte il token monouso.
- Pagine `/register` e `/login` con Reactive Forms e validazione allineata ai DTO backend; `/registrati` reindirizza alla pagina canonica `/register`.
- Access token JWT in memoria, Bearer sulle richieste `/api/`, refresh automatico su 401 e cookie HttpOnly inviato con `withCredentials`.
- Guard sulle route delle spese; il dettaglio interroga il backend anche dopo un accesso diretto.
- 44 test Angular passati il 2026-10-12; build production riuscita con avviso sul budget iniziale di 500 kB. Il test backend di integrazione del flusso auth/Expense resta separato, con MySQL e mail simulata.
- Gli errori di connessione nella verifica email mostrano un messaggio distinto dai token invalidi o scaduti.

## WIP / blocchi
- Il frontend dell'editing inline è funzionalmente verificato.
- Resta da rieseguire il percorso manuale nel browser dopo la correzione della verifica email.
- Gli URL API Angular usano `http://localhost:8080` in sviluppo e URL relativi con proxy Vercel in produzione. Il link email backend è configurabile tramite `FRONTEND_URL`; in locale usa localhost.
- Il form può inviare anche in modalità demo; il backend con Brevo deve essere configurato e abilitato prima del deploy frontend. La verifica email resta obbligatoria.

## Prossima azione
Eseguire il percorso manuale completo nel browser e verificare la scadenza/rotazione della sessione.

## Priorità tecniche successive
- uniformare loading, errori e conferme;
- separare configurazione sviluppo/produzione;
- ampliare i test Angular.

## Limiti
Dashboard ed entrate non fanno parte del verticale locale corrente. La verifica completa via browser e la registrazione pubblica restano aperte.

## Regola di sincronizzazione
Quando cambia il contratto REST del backend, controllare modelli, service HTTP e form del frontend prima di aggiornare la documentazione pubblica. A fine sessione significativa aggiornare questo file insieme alla scheda Notion del progetto.


## Tema UI — 2026-10-02
Pulsante sole/luna accessibile nell’intestazione, tema coerente con i colori esistenti e scelta ricordata nel browser.

## Anteprima UI — 2026-10-12

Il branch `feature/newui` introduce PrimeNG 21.1.10 (compatibile con Angular 21), Aura, PrimeIcons e GSAP. Prima fase: sidebar desktop/menu mobile, login e dashboard; Bootstrap resta per le pagine non ancora migrate. Login e dashboard usano `loadComponent` per evitare di caricare tutta la nuova UI all'avvio. I movimenti recenti provengono da `GET /api/expenses` e `GET /api/incomes`, combinati e ordinati per data dal service; il riepilogo usa sempre `GET /api/dashboard/summary`. Non vengono aggiunti endpoint o statistiche mensili senza dati. Gli errori API non vengono presentati come saldo zero. Le animazioni partono sul browser e vengono saltate con `prefers-reduced-motion`. Credenziali, cookie, login demo e invio registrazione restano gestiti dai service esistenti.

Verifica della UI prima del merge: build production riuscita, 47 test Angular passati, incluso errore 503 del riepilogo con importi indisponibili e movimenti ancora visibili. Restano avvisi sui budget di dimensione (iniziale circa 894 kB, CSS login/dashboard sotto il limite massimo di 8 kB). L'anteprima visuale locale usa risposte API simulate con dati fittizi, senza scrivere nel database condiviso.


## Demo e form di registrazione — 2026-10-12

Frontend Vercel e backend Render sono online, con login condiviso e proxy Vercel. Il pulsante «Prova la demo» usa l'account condiviso: le modifiche sono visibili agli altri visitatori e vanno usati solo dati fittizi. SMTP/Mailpit resta il flusso locale; il servizio email HTTPS online è un passo successivo. Vedere DEPLOYMENT.md per deploy e verifiche.

Il form `/register` è raggiungibile da header e login anche nella demo; `/registrati` è un alias con redirect. Nella demo i campi sono visibili, il pulsante è disabilitato e il metodo `submit()` impedisce richieste a `POST /auth/register`. In locale il form invia username, email e password, attende il successo e chiede di verificare l'email prima del login. Le risposte `409` distinguono `EMAIL_ALREADY_EXISTS` e `USERNAME_ALREADY_EXISTS` tramite `errorName`, con fallback generico; gli errori di rete e `503` indicano che il server non è disponibile.


## Revisione prima del merge UI — 2026-10-12

Verificati nel browser con le API reali: login demo, lettura riepilogo/spese/entrate, filtri, refresh dopo reload e persistenza del tema; creazione, modifica, dettaglio ed eliminazione di una spesa fittizia. Le spese di verifica sono state eliminate. Le entrate sono state lette e il form validato, senza creare record permanenti perché non è disponibile la cancellazione. Corretti contrasto di importi/errori nel tema scuro, azioni della lista spese precedentemente nascoste fuori dal passaggio del mouse, e formattazione di `null` come dato indisponibile anziché zero.


## Migrazione completa UI — 2026-10-12

Tutte le 10 pagine canoniche e i componenti di spesa sono migrati a PrimeNG 21/Aura; restano gli alias e le rotte originali. Bootstrap, Popper, stylesheet/script Bootstrap, utility CSS e data-bs-theme sono rimossi. I controlli importo/categoria/data usano InputNumber (it-IT), Select e DatePicker: Reactive Forms e DTO conservano importi numerici, enum originali e date ISO. Tutte le rotte usano loadComponent. Card, form, pulsanti, messaggi e skeleton condividono i token --ui-*; muted light scurito a #63756b e locale PrimeNG italiano. codex/style.md definisce ora un unico sistema UI senza Bootstrap.

Verifica: 55 test Angular passati; build production riuscita, bundle iniziale circa 622 kB (prima circa 894 kB), entro limite massimo 1 MB. Browser: tutte le 10 pagine su desktop chiaro e mobile scuro, nessun overflow o errore JS; form di entrambe le transazioni con POST simulato verificano 4,20 € -> 4.2 e data ISO senza scritture nel DB condiviso. Verificati anche stati vuoti/errori/404 e successo/errore verifica email con risposte simulate e un solo POST per token. Con API reali verificati login, refresh, tema, filtri, CRUD completo di una spesa fittizia poi eliminata, logout e blocco signup demo. Il provider email pubblico resta da integrare.

## Registrazione online — 2026-10-25

Rimosso il blocco `environment.demo` dal submit di registrazione e dal pulsante. Login demo condiviso conservato. L'errore backend 503 EMAIL_DELIVERY_FAILED mostra un messaggio specifico, senza successo prematuro e con possibilità di retry. Aggiornati i test di registrazione online e il testo nel login.

Distribuire prima il backend con Brevo configurato (MAIL_PROVIDER, BREVO_API_KEY, MAIL_FROM, FRONTEND_URL e REGISTRATION_ENABLED), poi questo frontend. Build e test Angular non eseguiti in questo ambiente privo delle dipendenze del progetto; la prova completa con invio reale resta aperta. Le sezioni datate 12 ottobre descrivono lo stato storico precedente.

## Verifica deploy registrazione — 2026-10-25

Backend Render live: deploy `dep-dbf1v8ek1f9s73fptho0`, commit `76fec7db0f4f86fb9764ca087836e12df7c094c7`. Il servizio segue ancora `demo/render-aiven-setup`, avanzato senza force dal vecchio commit alla versione integrata in master. Profilo demo conservato; MAIL_PROVIDER=brevo e REGISTRATION_ENABLED=true configurati su Render preservando i segreti esistenti.

Verifiche completate: 3 test Brevo con Java 21 passati; 56 test Angular passati e build production riuscita con gli avvisi sui budget già presenti. Browser pubblico /register: pulsante Registrati abilitato. API pubblica: health 200, username portfolio-demo già esistente respinto con 409 USERNAME_ALREADY_EXISTS (anche tramite proxy Vercel), token verifica inesistente 400, accesso anonimo alle spese 401, login demo 200 e lettura spese autenticata 200. La prova del duplicato non crea utenti e non invia email.

Resta da verificare con un indirizzo reale: registrazione nuova, accettazione/consegna Brevo, ricezione del link, conferma e login del nuovo account. Nessuna email reale inviata durante questi controlli. Le precedenti note su test non eseguibili sono superate per i test mirati citati; non è stata rieseguita l'intera suite backend con MySQL.

## Avvisi della sessione demo — 2026-10-25

La registrazione pubblica e la ricezione dell'email sono state confermate dal proprietario. Il banner DEMO e la nota Spazio demo nella sidebar ora compaiono soltanto per il subject JWT portfolio-demo, anche dopo refresh. Il decoding del token serve soltanto alla presentazione: autenticazione e autorizzazione restano sul backend. Login demo disponibile e environment.demo conservato per il relativo pulsante. Rimosso il tooltip che dichiarava la registrazione indisponibile. Verifica: 60 test Angular passati; build production riuscita con i consueti avvisi sui budget.

## CRUD entrate e liste — 2026-10-25, branch in verifica

Scope autorizzato: CRUD completo entrate, liste paginate dal database, ordinamento data/ID, mese/anno, ricerca titolo/descrizione/importo/data e firma fabiozagariadev con portfolio e GitHub. Nessuna modifica agli endpoint array usati dai grafici. Nuovi endpoint /api/{expenses,incomes}/search. Angular /summary e /incomes usano un componente condiviso con client HTTP dedicato, gestione errori, modifica completa e conferma cancellazione.

Verifiche: build frontend e 62 test Angular passati; 6 test backend mirati passati con Java 21 e Mockito agent esterno. Nuova regressione MySQL aggiunta ad AuthExpenseFlowTests, ancora da eseguire su database isolato. Nessun dato o configurazione del deploy alterato. Prima del merge: suite con MySQL e controllo browser desktop/mobile, chiaro/scuro; poi deploy backend e frontend coordinati.

## Verifica MySQL completata — 2026-10-25

Supera la precedente nota sulla suite database non eseguita. Suite Maven completa: 14 test, zero fallimenti/errori/skipped, Java 21.0.13 e MySQL Community 8.0.46 locale temporaneo. Database dedicato `expense_tracker_verification`, connessione su loopback, processo arrestato a fine prova; nessun dato online usato. Incluso `incomeCrudSearchAndOwnership`: GET/PUT/PATCH/DELETE altrui respinti con 404, CRUD proprietario, mese, titolo/descrizione, importo con virgola e date ISO/italiane. Test esistenti auth/spese/demo e 3 test Brevo inclusi. Frontend: build e 62 test passati; link entrate dalla dashboard corretto nel commit b12238f0f2ec953d8a2f31280a8601dc266493c6, stato Vercel success. Il proprietario ha confermato il caricamento delle liste. Resta il controllo browser completo desktop/mobile e temi.
