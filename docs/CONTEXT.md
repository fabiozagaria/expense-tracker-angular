# Contesto tecnico — Gestionale Spese Frontend

Aggiornato: 2026-09-21

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
- Pagine `/register` e `/login` con Reactive Forms e validazione allineata ai DTO backend.
- Access token JWT in memoria, Bearer sulle richieste `/api/`, refresh automatico su 401 e cookie HttpOnly inviato con `withCredentials`.
- Guard sulle route delle spese; il dettaglio interroga il backend anche dopo un accesso diretto.
- Build Angular e 20 test passati; test backend di integrazione del flusso auth/Expense passato con MySQL e mail simulata.

## WIP / blocchi
- Il frontend dell'editing inline è funzionalmente verificato.
- Resta da eseguire il percorso manuale nel browser con Mailpit e i due server avviati.
- Gli URL API e il link di verifica email sono ancora fissati su localhost: la demo pubblica non ha un backend pubblicato.

## Prossima azione
Eseguire il percorso manuale completo nel browser e verificare la scadenza/rotazione della sessione.

## Priorità tecniche successive
- uniformare loading, errori e conferme;
- separare configurazione sviluppo/produzione;
- ampliare i test Angular.

## Limiti
Dashboard ed entrate non fanno parte del verticale corrente. La verifica via browser e la configurazione di produzione dell'autenticazione restano aperte.

## Regola di sincronizzazione
Quando cambia il contratto REST del backend, controllare modelli, service HTTP e form del frontend prima di aggiornare la documentazione pubblica. A fine sessione significativa aggiornare questo file insieme alla scheda Notion del progetto.
