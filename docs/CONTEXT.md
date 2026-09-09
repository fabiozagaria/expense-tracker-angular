# Contesto tecnico — Gestionale Spese Frontend

Aggiornato: 2026-09-09

## Obiettivo corrente
Completare il verticale Expense del Gestionale Spese mantenendo il frontend Angular allineato alla REST API Spring Boot.

## Stato osservato
- Versione dichiarata: 0.3.0.
- Angular 21, TypeScript 5.9, Signals, Reactive Forms, HttpClient e RxJS.
- CRUD Expense collegato al backend: GET, POST, PATCH e DELETE verificati manualmente end-to-end con persistenza MySQL.
- Editing inline convertito a un unico `FormGroup`: rimossi i signal duplicati, submit invalido bloccato, valori letti con `getRawValue()`.
- Salvataggio editing gestito tramite `(ngSubmit)` sul form; il bottone `Salva` resta `type="submit"`.
- PATCH verificato anche nel caso descrizione con testo → stringa vuota; la lista si aggiorna dalla risposta del backend.
- Deploy Vercel del commit frontend finale verificato con stato `success`.
- Backend separato nel repository `expense-tracker-api`.

## WIP / blocchi
- Il frontend dell'editing inline è funzionalmente verificato.
- Il verticale completo non è considerato stabile finché il backend non torna compilabile/avviabile dopo le modifiche sperimentali su `User`, relazione `owner` e Spring Security.
- Mancano ancora test comportamentali automatici adeguati.

## Prossima azione
Non ampliare il frontend. Attendere il ripristino del backend Expense e poi rieseguire una verifica end-to-end del verticale prima di proseguire con autenticazione o nuove feature.

## Priorità tecniche successive
- verificare `GET /api/expenses/{id}` dal backend invece del solo stato locale;
- uniformare loading, errori e conferme;
- separare configurazione sviluppo/produzione;
- ampliare i test Angular.

## Limiti
Dashboard, entrate e autenticazione non devono essere presentate come completate finché non sono realmente implementate e verificate.

## Regola di sincronizzazione
Quando cambia il contratto REST del backend, controllare modelli, service HTTP e form del frontend prima di aggiornare la documentazione pubblica. A fine sessione significativa aggiornare questo file insieme alla scheda Notion del progetto.