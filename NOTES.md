# Notes

## Preferenze dell'utente
- Lingua di lavoro: italiano (lezioni, quiz, spiegazioni). Termini tecnici IT possono restare in inglese dove è naturale (es. "backup", "middleware").
- Vuole quiz di verifica con retrieval practice dopo ogni lezione, non solo letture passive.
- Per le materie giuridiche, citare sempre la fonte normativa primaria (normattiva.it o equivalente) — vedi [[RESOURCES]].
- Ordine di studio: 🔴 (gap reale) → 🟡 (parzialmente nuovo) → 🟢 (ripasso rapido) → 16. Inglese in parallelo per tutto il percorso.
- Percorso stimato: ~8-9 settimane. Data prova scritta non ancora nota (min. 15 giorni di preavviso) — monitorare il bando InPA.
- Formato quiz reale: 60 quesiti/120 min, soglia 21/30, penalità -0,25 per risposta errata → nei quiz di verifica vale la pena includere l'opzione "non rispondo" per allenare la strategia di skip su incertezza, non solo la correttezza.

## Contesto utente
- Senior SDET, 15+ anni: Playwright/TypeScript, Robot Framework/Python, Selenium, Appium, Jenkins, GitLab CI/CD, Docker.
- Forte su materie tecniche (zona 🟢): niente lezioni introduttive lì, solo adattamento terminologico al formato quiz PA.
- Nessuna esperienza pregressa in materie giuridico-amministrative (zona 🔴) — trattarle come dominio nuovo, senza dare per scontato vocabolario giuridico di base (es. "atto amministrativo", "silenzio-assenso").

## Working notes
- Checklist per ogni nuova lezione HTML: deve includere `<script src="../assets/quiz.js"></script>` a fondo pagina, altrimenti i pulsanti quiz risultano non cliccabili (bug riscontrato e corretto nella lezione 1).
- `assets/quiz.js` ora mescola automaticamente l'ordine delle opzioni ad ogni caricamento pagina (bug: la risposta corretta era sempre la prima, un indizio di formattazione). Nessuna azione richiesta nelle lezioni: continuare a scrivere `data-correct="true"` in qualsiasi posizione nel markup, lo shuffle è gestito dal componente.
- Prima materia scelta per la lezione 1: CAD (materia 5) — ponte naturale tra il background tecnico dell'utente e il linguaggio giuridico-amministrativo, essendo la materia giuridica più "tecnica" delle quattro in zona 🔴.
- Ordine previsto all'interno della zona 🔴: 5 (CAD) → 6 (diritto amministrativo, propedeutico a capire il "linguaggio" degli altri testi) → 14 (D.Lgs 165/2001) → 15 (L.190/2012 + D.Lgs 33/2013, che si appoggia ai concetti di trasparenza già visti in CAD e diritto amministrativo).
- Gap in RESOURCES.md da colmare quando si arriverà a quelle materie: fonti per "Principi di IA" (materia 3) e "Lingua inglese" (materia 16).
