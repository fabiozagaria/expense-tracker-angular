# Contesto tecnico — Gestionale Spese Frontend

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
- La registrazione pubblica resta disabilitata nel frontend e nel backend demo finché non sarà integrato il servizio email HTTPS. Il form resta visibile online; non viene aggirata la verifica email.

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


## Demo e form di registrazione — 2026-10-12

Frontend Vercel e backend Render sono online, con login condiviso e proxy Vercel. Il pulsante «Prova la demo» usa l'account condiviso: le modifiche sono visibili agli altri visitatori e vanno usati solo dati fittizi. SMTP/Mailpit resta il flusso locale; il servizio email HTTPS online è un passo successivo. Vedere DEPLOYMENT.md per deploy e verifiche.

Il form `/register` è raggiungibile da header e login anche nella demo; `/registrati` è un alias con redirect. Nella demo i campi sono visibili, il pulsante è disabilitato e il metodo `submit()` impedisce richieste a `POST /auth/register`. In locale il form invia username, email e password, attende il successo e chiede di verificare l'email prima del login. Le risposte `409` distinguono `EMAIL_ALREADY_EXISTS` e `USERNAME_ALREADY_EXISTS` tramite `errorName`, con fallback generico; gli errori di rete e `503` indicano che il server non è disponibile.
