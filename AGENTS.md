# Istruzioni per assistenti AI

## Scopo
Frontend Angular del Gestionale Spese full stack. Il repository è in sviluppo attivo e deve restare coerente con il backend `expense-tracker-api`.

## Regole operative
- Leggere `README.md` e `docs/CONTEXT.md` prima di modifiche ampie.
- Verificare il contratto REST reale prima di cambiare modelli, service o form.
- Preferire modifiche incrementali e tipizzate; non introdurre funzionalità non presenti nella roadmap tecnica del progetto senza richiesta esplicita.
- Mantenere separati stato UI, chiamate HTTP e responsabilità dei componenti.
- Prima di dichiarare completata una modifica, verificare test/build pertinenti quando disponibili.

## Fonti di verità
- Il codice frontend è la verità tecnica del client.
- Il backend `expense-tracker-api` è la verità sugli endpoint server realmente disponibili.
- `README.md` presenta lo stato pubblico; `docs/CONTEXT.md` sintetizza lo stato tecnico corrente.
- Roadmap didattica, voti e ripassi restano in Notion.

## Sicurezza
Non inserire token, credenziali, segreti o URL con dati sensibili.