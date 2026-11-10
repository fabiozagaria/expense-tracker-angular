# Pagina Impostazioni e `GET /api/me` — design

Data: 10 novembre 2026. Repository coinvolti: `expense-tracker-api` (backend) e `expense-tracker-angular` (frontend). Versione di arrivo: **1.2.0** per entrambi (funzionalità nuova e compatibile).

## Obiettivo

Un utente loggato ha una rotta **Impostazioni** dove vede il proprio account e può chiedere il link per cambiare la password, senza riscrivere l'email. Oggi il recupero password si raggiunge solo dal login e il client non conosce l'email dell'utente: il JWT contiene solo lo username (`sub`) e non esiste un endpoint che la restituisca.

## Cosa ha detto Fabio e cosa ho assunto

Detto: serve una rotta Impostazioni per l'utente loggato, che gestisce il recupero credenziali; la soluzione scelta è aggiungere `GET /api/me` al backend.

Assunto, e confermato nel design in chat:
- "Reinvia verifica" **non** entra in Impostazioni: il login è bloccato finché l'email non è verificata (`403 EMAIL_NOT_VERIFIED`), quindi un utente loggato è sempre verificato. Il flusso resta pubblico (`/resend-verification`, raggiungibile da login e da verifica email).
- Il cambio password è il link via email già esistente (`POST /auth/forgot-password`, poi `/reset-password`), non un nuovo endpoint con password attuale e nuova.

Fuori scopo: `POST /auth/change-password`, modifica di username ed email, eliminazione account, `emailVerified` nella risposta.

## Backend

`GET /api/me` restituisce `{ "username": string, "email": string }`.
- L'utente è quello del token (`Authentication.getName()`), quindi nessun utente legge il profilo di un altro. L'hash della password non è nel DTO.
- `SecurityConfig` non cambia: `anyRequest().authenticated()` già protegge la rotta. Senza token: 401.
- Componenti: record `ProfileResponse` (`dto/user`), `ProfileController` (`controllers`, tag OpenAPI "Profilo"), uso di `UserService.findByUsername` già esistente. Nessuna cache.
- Documentazione: riga nel contratto REST del README, nota in `docs/CONTEXT.md`, versione 1.2.0 nel POM.

## Frontend

Rotta `/settings`: `authGuard`, `loadComponent`, titolo "Impostazioni | Gestionale Spese", render solo client in `app.routes.server.ts`. Voce "Impostazioni" (icona `pi-cog`) nella navigazione principale per l'utente loggato, dopo "Movimenti".

La pagina ha due schede:
- **Il tuo account**: username ed email da `GET /api/me`, con stato di caricamento (skeleton), errore con pulsante "Riprova". Senza il profilo non compare il pulsante della password.
- **Password**: il pulsante "Invia link per cambiare password" chiama `AuthService.forgotPassword(email)` con l'email del profilo. Dopo l'invio la scheda mostra un messaggio di successo (link valido 30 minuti, controlla lo Spam, nuovo link possibile dopo un minuto) al posto del pulsante. Errori: 429, 503, timeout e rete usano `commonAuthErrorMessage`; `EMAIL_DELIVERY_FAILED` ha il suo testo. Il link porta alla pagina `/reset-password` che esiste già; dopo il reset il server chiude tutte le sessioni.
- **Sessione demo** (`auth.isDemoSession()`): l'account condiviso ha l'email `portfolio-demo@example.invalid`, quindi il link non arriverebbe mai. La scheda Password mostra solo la nota "La password dell'account demo condiviso non si può cambiare" e nessun pulsante.

Il client HTTP del profilo è un servizio dedicato (`features/settings/services/profile-api.service.ts`), separato da `AuthService`. Stile: `codex/style.md` (PrimeNG, token `--ui-*`, testi italiani).

## Ordine di rilascio

Backend prima (il frontend dipende da `/api/me`), poi frontend. Versioni, README e `docs/CONTEXT.md` di entrambi si aggiornano nelle rispettive PR. Tag e GitHub Release restano da fare dal computer di Fabio (questa sessione non riesce a pubblicare tag).

## Verifiche attese

- Backend: test di integrazione su MySQL Testcontainers (profilo corretto, isolamento fra utenti, nessun campo password, 401 senza token) e documentazione OpenAPI aggiornata.
- Frontend: test dei componenti e del servizio, build production, controllo nel browser con risposte simulate. Non verificabile da qui: il percorso reale con email vera (resta una prova manuale su Mailpit o Brevo).
