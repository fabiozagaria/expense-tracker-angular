# Contesto tecnico — Gestionale Spese Frontend

Aggiornato: 2026-09-18

## Obiettivo corrente
Mantenere il verticale Expense e il flusso di verifica email Angular allineati alla REST API Spring Boot.

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

## WIP / blocchi
- Il frontend dell'editing inline è funzionalmente verificato.
- La verifica email frontend è coperta da test del componente; resta da rieseguire il test manuale completo dopo ogni modifica del contratto backend.
- Il verticale completo non è considerato stabile finché il backend non torna compilabile/avviabile dopo le modifiche sperimentali su `User`, relazione `owner` e Spring Security.
- Mancano ancora test comportamentali automatici adeguati.

## Prossima azione
Eseguire una verifica manuale completa del link email: registrazione, ricezione del messaggio in Mailpit, conferma dal browser, login successivo e riuso del token rifiutato.

## Priorità tecniche successive
- verificare `GET /api/expenses/{id}` dal backend invece del solo stato locale;
- uniformare loading, errori e conferme;
- separare configurazione sviluppo/produzione;
- ampliare i test Angular.

## Limiti
Dashboard, entrate e autenticazione non devono essere presentate come completate finché non sono realmente implementate e verificate.

## Regola di sincronizzazione
Quando cambia il contratto REST del backend, controllare modelli, service HTTP e form del frontend prima di aggiornare la documentazione pubblica. A fine sessione significativa aggiornare questo file insieme alla scheda Notion del progetto.