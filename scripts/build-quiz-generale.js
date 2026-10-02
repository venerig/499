#!/usr/bin/env node
// Rebuilds quiz-generale.html by extracting every .quiz block from lessons/*.html
// and wrapping each in a .quiz-unit inside #quiz-round, matching the markup
// contract expected by assets/shuffle-quiz-round.js + assets/quiz.js.
//
// Special case: lesson 0028 (reading comprehension) has 5 quiz blocks that all
// depend on one shared passage. Since quiz-round shuffles .quiz-unit elements
// independently, the passage is duplicated into each of that lesson's units.
//
// Usage: node scripts/build-quiz-generale.js

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const lessonsDir = path.join(root, "lessons");

function extractQuizBlocks(html) {
  const blocks = [];
  const marker = '<div class="quiz" data-quiz>';
  let searchFrom = 0;
  while (true) {
    const start = html.indexOf(marker, searchFrom);
    if (start === -1) break;
    let depth = 0;
    let i = start;
    let end = -1;
    const tagRe = /<\/?div\b[^>]*>/g;
    tagRe.lastIndex = start;
    let m;
    while ((m = tagRe.exec(html))) {
      if (m[0].startsWith("</")) {
        depth--;
        if (depth === 0) {
          end = m.index + m[0].length;
          break;
        }
      } else {
        depth++;
      }
    }
    if (end === -1) throw new Error("Unbalanced .quiz div starting at " + start);
    blocks.push(html.slice(start, end));
    searchFrom = end;
  }
  return blocks;
}

const files = fs
  .readdirSync(lessonsDir)
  .filter((f) => /^\d{4}-.*\.html$/.test(f))
  .sort();

let units = [];
for (const file of files) {
  const html = fs.readFileSync(path.join(lessonsDir, file), "utf8");
  const quizzes = extractQuizBlocks(html);

  let passage = "";
  if (file === "0028-english-reading-comprehension.html") {
    const m = html.match(/<h2>Testo di esempio<\/h2>\s*<p[^>]*>[\s\S]*?<\/p>/);
    if (!m) throw new Error("Expected reading passage not found in " + file);
    passage = m[0] + "\n";
  }

  for (const quiz of quizzes) {
    units.push(`<div class="quiz-unit">\n${passage}${quiz}\n</div>`);
  }
}

const total = units.length;

const page = `<title>Quiz generale — Concorso INPS 499</title>
<link rel="stylesheet" href="assets/style.css">

<p class="eyebrow">Simulazione · Tutte le materie</p>
<h1>Quiz generale — round completo</h1>
<p class="subtitle">Tutte le ${total} domande di verifica delle ${files.length} lezioni, in un unico round con ordine casuale a ogni caricamento della pagina. Utile per un ripasso interleaved tra materie diverse, non solo all'interno della stessa lezione.</p>

<p class="progress">Torna all'<a href="index.html">indice delle lezioni</a> · Punteggio: <span id="lesson-quiz-score">0 / 0</span></p>

<div class="callout">
  <p class="callout-title">Come usarlo</p>
  <p>Le domande sono mescolate a ogni ricaricamento della pagina — anche l'ordine delle opzioni all'interno di ciascuna domanda cambia, come nelle singole lezioni. Il punteggio qui sopra si aggiorna in tempo reale man mano che rispondi, ed è visibile in ogni momento senza dover finire tutte le ${total} domande in un colpo solo.</p>
</div>

<div id="quiz-round">

${units.join("\n\n")}

</div>

<nav class="lesson-nav">
  <span><a href="index.html">← Torna all'indice delle lezioni</a></span>
</nav>

<script src="assets/shuffle-quiz-round.js"></script>
<script src="assets/quiz.js"></script>
`;

fs.writeFileSync(path.join(root, "quiz-generale.html"), page);
console.log(`Wrote quiz-generale.html: ${total} questions from ${files.length} lessons.`);
