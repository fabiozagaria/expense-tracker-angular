# Contesto tecnico — Gestionale Spese Frontend

Aggiornato: 2026-09-08

## Obiettivo corrente
Completare il verticale Expense del Gestionale Spese mantenendo il frontend Angular allineato alla REST API Spring Boot.

## Stato osservato
- Versione dichiarata: 0.3.0.
- Angular 21, TypeScript 5.9, Signals, Reactive Forms, HttpClient e RxJS.
- Lettura, creazione, modifica e rimozione delle spese già previste nel client.
- Backend separato nel repository `expense-tracker-api`.

## Priorità tecniche dichiarate
- verificare l'editing inline con Reactive Forms;
- verificare tutti gli endpoint del verticale Expense;
- uniformare loading, errori e conferme;
- separare configurazione sviluppo/produzione;
- ampliare i test.

## Limiti
Dashboard, entrate e autenticazione non devono essere presentate come completate finché non sono realmente implementate.

## Regola di sincronizzazione
Quando cambia il contratto REST del backend, controllare modelli, service HTTP e form del frontend prima di aggiornare la documentazione pubblica.