# Istruzioni UI — Gestionale Spese

Queste regole guidano le modifiche alla UI Angular del progetto. Leggerle prima di creare o aggiornare pagine, componenti, stili o animazioni. Le istruzioni esplicite dell'utente hanno precedenza; aggiornare questa guida quando cambia la direzione visiva condivisa.

## 1. Direzione visiva

- Aspetto di un gestionale finanziario: ordinato, sobrio e leggibile.
- Sidebar verde petrolio, sfondo avorio, superfici pulite e accenti smeraldo.
- Dare priorità a saldo, importi, movimenti e azioni utili. Una sola azione primaria per sezione.
- Usare spaziatura regolare, bordi sottili, angoli arrotondati e ombre leggere.
- Evitare gradienti vistosi, glassmorphism, effetti neon e decorazioni che competono con i dati.
- Scrivere etichette e messaggi in italiano, con parole semplici e coerenti fra le pagine.

## 2. Stack e componenti

- Usare **PrimeNG 21**, tema **Aura**, **PrimeIcons** e **GSAP**, già installati e compatibili con Angular 21.
- Preferire i componenti PrimeNG per pulsanti, input, selettori, tabelle, dialog e skeleton. Importare solo i moduli necessari nel componente standalone.
- La configurazione del tema è in [`app.config.ts`](../src/app/app.config.ts); i token globali sono in [`styles.css`](../src/styles.css).
- Bootstrap resta nelle pagine non ancora migrate. Migrare una pagina alla volta; non mescolare due componenti equivalenti delle librerie nello stesso controllo.
- Non aggiungere un'altra libreria UI o di animazione per replicare funzionalità già disponibili.
- Preferire token e API di personalizzazione PrimeNG agli override interni. Limitare `::ng-deep` a override circoscritti sotto `:host`, quando necessari.

## 3. Colori e tema

Usare `var(--ui-...)` per superfici, testo e bordi. Evitare nuove palette locali per ogni pagina.

| Token | Tema chiaro | Tema scuro | Uso |
| --- | --- | --- | --- |
| `--ui-bg` | `#f5f7f4` | `#111d19` | Sfondo pagina |
| `--ui-surface` | `#ffffff` | `#192823` | Schede e pannelli |
| `--ui-surface-alt` | `#f8faf7` | `#1d2e27` | Superfici secondarie |
| `--ui-border` | `#e5eae5` | `#2b3c33` | Bordi e separatori |
| `--ui-text` | `#172b26` | `#e2eee7` | Testo principale |
| `--ui-muted` | `#73827b` | `#a2b5a8` | Testo secondario |
| `--ui-accent` | `#08765b` | `#74cfa9` | Link e accenti |
| `--ui-accent-soft` | `#eaf5ed` | `#243f32` | Accenti di superficie |

- Sidebar: `#122b26`. Scheda saldo: `#133f32`, con testo chiaro.
- Entrate: verde; spese: accento caldo e discreto. Aggiungere sempre etichetta, icona o segno dell'importo: il colore da solo non basta.
- Per i pulsanti primari con testo bianco usare lo sfondo `#08765b` e hover `#075a48`. L'accento chiaro del tema scuro non va abbinato automaticamente al testo bianco.
- Verificare il contrasto in entrambi i temi: almeno 4,5:1 per testo normale e 3:1 per testo grande e indicatori dei controlli. Non usare il testo attenuato dove rende difficile leggere un dato essenziale.
- Conservare il tema gestito dal servizio esistente, la preferenza salvata e gli attributi `data-theme`/`data-bs-theme`. PrimeNG usa `[data-theme="dark"]`.

## 4. Tipografia e spaziatura

- Font **Inter**, con fallback `system-ui, sans-serif`.
- Corpo pagina di riferimento: 14 px. Titoli pagina: 27–38 px; titoli dei pannelli: 18–24 px.
- Importi principali: 25–33 px, peso 600 e cifre tabulari. Evitare che importi lunghi escano dalla scheda.
- Le microetichette possono essere più piccole; non ridurre testi funzionali e valori per farli entrare nel layout.
- Usare soprattutto pesi 400, 500 e 600. Riservare le maiuscole alle brevi etichette di sezione.
- Spaziatura basata su multipli di 4 px: 8, 12, 16, 24, 32. Pannelli con circa 20–24 px di padding.
- Schede con raggio di circa 15 px; pulsanti e controlli con raggio di 6–10 px.
- Formattare valuta e date in italiano. Usare `Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })` e i formatter Angular con locale `it-IT`.

## 5. Layout responsive

- Desktop: sidebar fissa di **236 px**, contenuto principale e footer allineati a destra della sidebar. Contenuto della dashboard con larghezza massima di circa 1220 px.
- Sotto **992 px**: topbar, menu apribile e nessun margine riservato alla sidebar. Tema accessibile anche quando il menu è chiuso.
- Sotto **700 px**: schede impilate, intestazioni adattate e azioni facilmente raggiungibili.
- Tabelle mobile: mantenere visibili almeno movimento e importo. Nella dashboard categoria e data si nascondono; nelle altre viste scegliere una soluzione che conservi i dati necessari al compito.
- Nessun overflow orizzontale dell'intera pagina. Se una tabella richiede scorrimento, limitarlo al suo contenitore e renderlo riconoscibile.
- Evitare altezze rigide per pannelli con testo o messaggi di errore. Verificare anche titoli lunghi, importi elevati e liste vuote.

## 6. Animazioni

Le animazioni accompagnano la lettura e confermano le interazioni, senza rallentare le operazioni.

- Riutilizzare [`RevealDirective`](../src/app/core/ui/reveal.directive.ts) con `appReveal` sul contenitore e `data-reveal` sugli elementi da animare.
- Ingresso attuale: spostamento verticale di 18 px, durata 0,6 s, stagger 0,065 s ed easing `power2.out`.
- Hover e transizioni dei controlli: circa 160–200 ms; spostamenti minimi e ombre leggere.
- Usare GSAP solo dopo il rendering nel browser, con import dinamico, contesto limitato al componente e cleanup alla distruzione.
- Rispettare `prefers-reduced-motion: reduce`: saltare gli ingressi GSAP e ridurre le transizioni non essenziali.
- Il contenuto deve restare leggibile se l'animazione non parte. Non impostare `opacity: 0` permanente come stato iniziale nel CSS.
- Non ripetere gli ingressi a ogni aggiornamento dei dati. Evitare loop decorativi e animazioni su tutte le righe di liste lunghe.

Esempio di template, dopo aver importato `RevealDirective` nel componente:

```html
<section appReveal>
  <header data-reveal>...</header>
  <article class="metric" data-reveal>...</article>
  <article class="transactions-panel" data-reveal>...</article>
</section>
```

## 7. Form, navigazione e accessibilità

- Usare **Reactive Forms** per inserimento e modifica dei dati, con controlli tipizzati e validazione coerente con i DTO backend.
- Conservare ID, label, autocomplete e riferimenti accessibili dei form esistenti. Collegare gli errori al campo con `aria-describedby` e impostare `aria-invalid`.
- Mostrare errori specifici dopo l'interazione o il tentativo di invio. Disabilitare gli invii duplicati durante il salvataggio.
- Usare link per navigare e pulsanti per eseguire azioni. Specificare `type="button"` sui pulsanti che non inviano il form.
- Mantenere focus visibile, ordine di tabulazione naturale e label per i pulsanti con sola icona. Le icone decorative usano `aria-hidden="true"`.
- Il menu mobile deve esporre `aria-expanded`/`aria-controls`, chiudersi con Escape e dopo la navigazione.
- Nei dialog, gestire il focus e restituirlo al controllo di apertura. Le azioni distruttive devono essere riconoscibili.
- Rendere le azioni mobile facili da toccare, con area interattiva di riferimento di circa 44 × 44 px.

## 8. Dati e stati dell'interfaccia

- Prevedere caricamento, successo, elenco vuoto ed errore. Usare skeleton coerenti con il layout per ridurre i salti della pagina.
- Non rappresentare un errore API come saldo zero. Se il dato non è disponibile, usare un trattino e un messaggio comprensibile.
- I dati reali provengono dai service esistenti. Non inserire importi, percentuali, trend mensili o grafici inventati nel codice di produzione.
- Le fixture per screenshot e anteprime devono essere chiaramente indicate come dati di esempio e rimanere separate dai dati reali.
- Separare errori del riepilogo ed errori della lista, così una sezione disponibile resta utilizzabile.
- Il dashboard service combina spese ed entrate e le ordina per data; la UI filtra e mostra gli ultimi sei movimenti. Non implementare chiamate HTTP direttamente nel template o nei componenti di presentazione.
- Per le entrate, non mostrare azioni di modifica o cancellazione finché non esiste il relativo contratto backend.

## 9. Vincoli funzionali da preservare

- Un restyling deve conservare rotte, guard, servizi, contratto REST e comportamento dei form.
- Preservare login demo, gestione del risveglio, access token in memoria, cookie HttpOnly, refresh e logout.
- Conservare l'avviso sull'account demo condiviso e l'invito a usare solo dati fittizi.
- La registrazione pubblica resta disabilitata in attesa del servizio email di verifica. Non abilitarla come conseguenza di una modifica grafica.
- Mantenere le chiamate relative e il proxy di produzione. Non indebolire CORS o controlli dell'origine per rendere funzionante un'anteprima.

## 10. Verifica delle modifiche

- Confrontare visivamente la pagina con dashboard, login e navigazione del branch `feature/newui`.
- Controllare desktop, mobile a circa 390 px, tema chiaro/scuro, tastiera e movimento ridotto, secondo le aree modificate.
- Verificare errori e stati vuoti quando si modificano dati o form. Usare fixture separate per anteprime riproducibili.
- Eseguire `npm run build` per modifiche al codice UI, dipendenze o stili. Se cambia il comportamento, eseguire anche i test pertinenti (`npm test -- --watch=false`). Una modifica solo a questa documentazione non richiede build o test Angular.
- Mantenere le pagine pesanti caricate al bisogno con `loadComponent`. Non aumentare i budget di bundle o CSS solo per nascondere un errore: valutare prima import, caricamento e duplicazioni.
- Aggiornare questa guida se vengono introdotti nuovi token, componenti condivisi o convenzioni visive.
