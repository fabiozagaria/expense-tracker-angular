# Istruzioni per assistenti AI

## Scopo
Frontend Angular di Expense Tracker, applicazione full stack. Il repository è in sviluppo attivo e deve restare coerente con il backend `expense-tracker-api`.

## Regole operative
- Usare sempre **Expense Tracker** come nome pubblico del sito, del progetto e del servizio, anche in titoli, metadati e documentazione. Conservare gli URL e gli identificatori tecnici esistenti finché non viene richiesta una migrazione.
- Leggere `README.md` e `docs/CONTEXT.md` prima di modifiche ampie.
- Per modifiche alla UI, leggere e seguire [`codex/style.md`](codex/style.md).
- Verificare il contratto REST reale prima di cambiare modelli, service o form.
- Preferire modifiche incrementali e tipizzate; non introdurre funzionalità non presenti nella roadmap tecnica del progetto senza richiesta esplicita.
- Mantenere separati stato UI, chiamate HTTP e responsabilità dei componenti.
- Prima di dichiarare completata una modifica, verificare test/build pertinenti quando disponibili.
- **Documentazione sempre allineata.** Ogni modifica (codice, struttura, stato, decisione, versione) aggiorna nella stessa PR tutti i documenti che la riguardano: `README.md`, `docs/CONTEXT.md`, `docs/DEPLOYMENT.md`, `FUTURE.md`, `codex/style.md` se cambia lo stile, questo file e la scheda Notion del progetto. Se cambiano versione, stato, descrizione o schema del progetto, controllare anche la sua scheda nel portfolio (`fabio-zagaria-portfolio`: dati in `portfolio-angular/src/app/data`, `README.md` e `docs/CONTEXT.md`). Prima di dichiarare finito un lavoro, passare in rassegna l'elenco e dire per ciascun documento se è stato aggiornato o perché non serve. Una modifica senza documenti allineati non è Done.

## Fonti di verità
- Il codice frontend è la verità tecnica del client.
- Il backend `expense-tracker-api` è la verità sugli endpoint server realmente disponibili.
- `README.md` presenta lo stato pubblico; `docs/CONTEXT.md` sintetizza lo stato tecnico corrente.
- Roadmap didattica, voti e ripassi restano in Notion.

## Sicurezza
Non inserire token, credenziali, segreti o URL con dati sensibili.
