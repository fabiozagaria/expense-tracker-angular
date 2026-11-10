# Pagina Impostazioni e `GET /api/me` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un utente loggato vede il proprio account in una rotta `/settings` e può chiedere il link per cambiare la password senza riscrivere l'email.

**Architecture:** Il backend espone `GET /api/me` (username ed email del token). Il frontend aggiunge un servizio HTTP dedicato per il profilo e una pagina lazy `/settings` che riusa `AuthService.forgotPassword` e la pagina `/reset-password` esistenti. Backend rilasciato per primo.

**Tech Stack:** Spring Boot 4.1 / Java 21 / JUnit con Testcontainers MySQL (backend, repo `expense-tracker-api`); Angular 21, PrimeNG 21, Vitest (frontend, repo `expense-tracker-angular`).

**Spec:** `docs/superpowers/specs/2026-11-10-settings-page-design.md` (repo frontend).

## Global Constraints

- Risposta di `GET /api/me`: esattamente `{"username": string, "email": string}`. Mai l'hash della password, mai `emailVerified`.
- L'utente è sempre quello del token (`Authentication.getName()`); nessun parametro per scegliere un altro utente.
- `SecurityConfig` non cambia; senza token la risposta è 401.
- Link di reset valido 30 minuti; cooldown di 60 secondi lato server (risposta 202 anche se non invia).
- Account demo: username `portfolio-demo`, email `portfolio-demo@example.invalid`; riconosciuto con `AuthService.isDemoSession()`.
- Testi in italiano, senza maiuscole forzate né frecce nei link; stile di `codex/style.md` (token `--ui-*`, PrimeNG, `ui-page`/`p-card`).
- Versione di entrambi i repository: **1.2.0**. Commit con le righe `Co-Authored-By` e `Claude-Session` richieste; nessun tag né push di tag da questa sessione.
- Ogni repository: branch `agent/laughing-cray-n0qt0i` ripartito da `master`, una PR per repository, il backend va in `master` prima del frontend.

## Review Focus

1. Il token dell'utente A non restituisce mai l'email di B; la risposta non contiene campi password (test nel Task 1).
2. `GET /api/me` senza token → 401 e non 200 anonimo (Task 1).
3. Sessione demo: la scheda Password non ha il pulsante e non parte nessuna richiesta a `forgot-password` (Task 4).
4. Profilo non caricato (503, avvio a freddo, rete): errore con "Riprova" e nessun pulsante della password, perché senza email non si può inviare (Task 4).
5. Secondo clic dopo l'invio: dopo il successo il pulsante sparisce, così non si invita a rifare la richiesta entro il cooldown di 60 secondi (Task 4).

---

## Parte A — Backend (`/home/user/expense-tracker-api`)

### Task 1: `GET /api/me`

**Files:**
- Create: `src/main/java/org/esercizi/expensetrackerapi/dto/user/ProfileResponse.java`
- Create: `src/main/java/org/esercizi/expensetrackerapi/controllers/ProfileController.java`
- Test: `src/test/java/org/esercizi/expensetrackerapi/ProfileEndpointTests.java`
- Test: `src/test/java/org/esercizi/expensetrackerapi/OpenApiDocsTests.java` (aggiungere un'asserzione)

**Interfaces:**
- Produces: `record ProfileResponse(String username, String email)`; `GET /api/me` → 200 `ProfileResponse`, 401 senza token.
- Consumes: `UserService.findByUsername(String) : User` (esistente), `User.getUsername()`, `User.getEmail()`.

- [ ] **Step 1: Write the failing tests** in `ProfileEndpointTests`, stesso schema di `ExpenseListLimitTests` (`@SpringBootTest`, `@AutoConfigureMockMvc`, `@Transactional`, `@MockitoBean JavaMailSender`, helper `createVerifiedUser` e `login` copiati dal test esistente). Test:
  - `returnsOnlyUsernameAndEmailOfTheTokenOwner`: crea `meuser1` e `meuser2`, login come `meuser1`, `GET /api/me` → 200, `$.username == "meuser1"`, `$.email == "meuser1@example.test"`, `$.length() == 2`, `$.password` e `$.emailVerified` non esistono. Ripeti per `meuser2` con il suo token e controlla l'email diversa.
  - `rejectsRequestsWithoutAToken`: `GET /api/me` senza header → 401.
  In `OpenApiDocsTests.apiDocsAreServedWithoutAuthenticationAndDescribeTheContract` aggiungere `.andExpect(jsonPath("$.paths['/api/me']").exists())`.

- [ ] **Step 2: Run to verify they fail**

Run: `./mvnw test -Dtest=ProfileEndpointTests,OpenApiDocsTests`
Expected: FAIL (404 su `/api/me`, path OpenAPI assente). Serve Docker attivo per Testcontainers.

- [ ] **Step 3: Implement** `ProfileResponse` (record con i due campi) e `ProfileController` in `controllers`: `@RestController`, `@RequestMapping("/api/me")`, `@Tag(name = "Profilo", description = "Dati dell'utente autenticato.")`, un `@GetMapping` che prende `Authentication`, carica l'utente con `userService.findByUsername(authentication.getName())` e restituisce `new ProfileResponse(user.getUsername(), user.getEmail())`. Segui lo stile di `DashboardController`.

- [ ] **Step 4: Run to verify they pass**

Run: `./mvnw test -Dtest=ProfileEndpointTests,OpenApiDocsTests`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/main/java src/test/java
git commit -m "feat: add GET /api/me with the authenticated user's profile"
```

### Task 2: Versione 1.2.0 e documentazione del backend

**Files:**
- Modify: `pom.xml` (versione del progetto `1.1.0` → `1.2.0`)
- Modify: `README.md`, `docs/CONTEXT.md`, `docs/DEPLOYMENT.md`

**Interfaces:**
- Consumes: il contratto del Task 1.

- [ ] **Step 1: Aggiornare la versione e le docs.** POM e badge/versione del README a 1.2.0 con data; nel contratto REST del README una riga `GET /api/me` (username ed email dell'utente autenticato, 401 senza token); nelle sezioni "Stato corrente" di `docs/CONTEXT.md` e `docs/DEPLOYMENT.md` la 1.2.0, la novità e che il frontend 1.2.0 la usa. Riportare nelle verifiche solo ciò che è stato davvero eseguito.

- [ ] **Step 2: Verify**

Run: `./mvnw clean verify`
Expected: BUILD SUCCESS con tutti i test (serve Docker). Se Docker non è disponibile in questa sessione, dirlo nella PR e affidarsi alla CI di GitHub Actions, senza dichiarare i test passati.

- [ ] **Step 3: Commit, push, PR draft**

```bash
git add pom.xml README.md docs
git commit -m "chore: release 1.2.0 with GET /api/me documentation"
git push -u origin agent/laughing-cray-n0qt0i
```

Aprire la PR in bozza sul backend, controllare la CI e unire (su richiesta di Fabio) **prima** di unire il frontend.

---

## Parte B — Frontend (`/home/user/expense-tracker-angular`)

### Task 3: Servizio del profilo

**Files:**
- Create: `src/app/features/settings/services/profile-api.service.ts`
- Test: `src/app/features/settings/services/profile-api.service.spec.ts`

**Interfaces:**
- Produces: `interface Profile { username: string; email: string }`; `ProfileApiService.getProfile(): Observable<Profile>` (`GET ${environment.apiBaseUrl}/api/me`, `providedIn: 'root'`).

- [ ] **Step 1: Write the failing test.** `getProfile` fa una `GET` a `${environment.apiBaseUrl}/api/me` e restituisce il corpo `{ username: 'utente1', email: 'utente1@example.test' }` (usare `provideHttpClient` + `provideHttpClientTesting` come in `dashboard.service.spec.ts`).

- [ ] **Step 2: Run to verify it fails**

Run: `npx ng test --watch=false --include src/app/features/settings`
Expected: FAIL (modulo mancante).

- [ ] **Step 3: Implement** `ProfileApiService` con `HttpClient` iniettato, sul modello di `dashboard.service.ts`. Il Bearer lo aggiunge già l'interceptor sulle URL `/api/`.

- [ ] **Step 4: Run to verify it passes** (stesso comando). Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/features/settings
git commit -m "feat: add ProfileApiService for GET /api/me"
```

### Task 4: Pagina `/settings`, rotta e voce di menu

**Files:**
- Create: `src/app/features/settings/pages/settings/settings.ts`, `settings.html`, `settings.css`
- Test: `src/app/features/settings/pages/settings/settings.spec.ts`
- Modify: `src/app/app.routes.ts`, `src/app/app.routes.server.ts`
- Modify: `src/app/core/layout/header/header.html` (e `header.spec.ts` se controlla i link)

**Interfaces:**
- Consumes: `ProfileApiService.getProfile(): Observable<Profile>` (Task 3); `AuthService.forgotPassword(email: string): Observable<void>` e `AuthService.isDemoSession(): Signal<boolean>` (esistenti); `commonAuthErrorMessage(error: unknown): string | null` e `apiErrorName(error: unknown): string | null` da `core/api/api-error`.
- Produces: componente `Settings` (classe esportata `Settings`), rotta `settings`.

- [ ] **Step 1: Write the failing tests** in `settings.spec.ts` (HTTP simulato, stile di `reset-password.spec.ts`; per la demo si imposta il token con `auth.login` simulato o si sostituisce `AuthService.isDemoSession`):
  - `shows username and email from GET /api/me`: la pagina mostra `utente1` e `utente1@example.test`.
  - `sends the reset link to the profile email and hides the button afterwards`: clic su "Invia link per cambiare password" → `POST /auth/forgot-password` con body `{ email: 'utente1@example.test' }` → 202 → testo "valido per 30 minuti" visibile e pulsante assente.
  - `demo session shows a note and never calls forgot-password`: con sessione demo compare "non si può cambiare" e non c'è il pulsante (nessuna richiesta a `forgot-password`).
  - `profile failure shows an error with retry and no password button`: `GET /api/me` → 503 → messaggio d'errore e pulsante "Riprova" presenti, pulsante password assente; clic su "Riprova" rifà la `GET`.
  - `shows the rate-limit message`: `forgot-password` → 429 con `Retry-After: 45` → "Troppi tentativi. Riprova tra 45 secondi.".
  Nel test della navigazione: `header.html` mostra `a[href="/settings"]` solo con utente loggato.

- [ ] **Step 2: Run to verify they fail**

Run: `npx ng test --watch=false --include src/app/features/settings,src/app/core/layout`
Expected: FAIL.

- [ ] **Step 3: Implement.** Componente standalone `Settings` con signal `profile`, `loading`, `loadError`, `sending`, `sent`, `error`; `ngOnInit` carica il profilo (con `isPlatformBrowser`, come `verify-email`); metodo `sendLink()` che chiama `forgotPassword(profile.email)` e usa `finalize` per `sending`. Messaggi: successo e nota demo come da spec; errori con `commonAuthErrorMessage` e, per `EMAIL_DELIVERY_FAILED`, "Invio email non riuscito. Riprova più tardi.". Template con `ui-page`, `p-card` e `p-message` come `reset-password.html`; testo e `aria` in italiano; `aria-busy` durante il caricamento. Rotta `settings` in `app.routes.ts` con `authGuard`, `loadComponent`, titolo "Impostazioni | Gestionale Spese"; voce `settings` in `app.routes.server.ts` con `RenderMode.Client`; link "Impostazioni" con `pi-cog` nel blocco `@if (auth.accessToken())` di `header.html`, dopo "Movimenti".

- [ ] **Step 4: Run to verify they pass** (stesso comando). Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app
git commit -m "feat: add settings page with account data and password reset link"
```

### Task 5: Versione 1.2.0, documentazione e verifica nel browser

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm version 1.2.0 --no-git-tag-version`)
- Modify: `README.md`, `docs/CONTEXT.md`

**Interfaces:**
- Consumes: pagina e rotta del Task 4; il backend 1.2.0 del Task 2.

- [ ] **Step 1: Aggiornare versione e docs.** Badge, versione e "backend compatibile: 1.2.0" nel README; riga `/settings` nella tabella delle rotte e `GET /api/me` nella tabella REST; nota nelle "Funzionalità"; sezione datata in `docs/CONTEXT.md` con lo stato e il limite (percorso reale con email vera non verificato).

- [ ] **Step 2: Verify**

Run: `npx ng test --watch=false` e `npx ng build`
Expected: tutti i test passano; build riuscita con i soli avvisi di budget già noti.

- [ ] **Step 3: Controllo nel browser** sulla build di produzione in locale (`PORT=4300 node dist/expense-tracker/server/server.mjs`) con Playwright e risposte simulate di `/api/me` e `/auth/forgot-password`: pagina `/settings` su desktop (tema chiaro) e mobile (tema scuro) senza overflow né errori JS, pulsante inviato, caso demo e caso errore profilo. Riportare nella PR solo ciò che è stato visto.

- [ ] **Step 4: Commit, push, PR draft**

```bash
git add package.json package-lock.json README.md docs
git commit -m "chore: release 1.2.0 with the settings page"
git push -u origin agent/laughing-cray-n0qt0i
```

Aprire la PR in bozza sul frontend (include spec e piano) e unirla **dopo** quella del backend, su richiesta di Fabio. Tag `v1.2.0` e GitHub Release di entrambi i repository restano da creare dal computer di Fabio: preparare i comandi e le note come per la 1.1.0.
