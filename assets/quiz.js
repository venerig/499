// Shared retrieval-practice quiz component for the Concorso INPS teaching workspace.
//
// Markup contract:
// <div class="quiz" data-quiz>
//   <p class="quiz-q">Domanda?</p>
//   <div class="quiz-options">
//     <button class="quiz-option" data-correct="false">Risposta A</button>
//     <button class="quiz-option" data-correct="true">Risposta B</button>
//   </div>
//   <p class="quiz-feedback" data-feedback></p>
//   <div class="quiz-explain" data-explain>Spiegazione + fonte.</div>
// </div>
//
// Optional: an element with id="lesson-quiz-score" is kept in sync as
// "N / M" across every .quiz on the page.
//
// Wrong answers are saved in localStorage (this browser only); a later
// correct answer removes them. With ?errori in the URL, a #quiz-round page
// keeps only the saved questions. id="errori-count" shows how many are saved.

(function () {
  var STORE = "inps499-errori";

  function loadErrors() {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) { return []; }
  }

  function saveErrors(list) {
    try { localStorage.setItem(STORE, JSON.stringify(list)); } catch (e) {}
    var countEl = document.getElementById("errori-count");
    if (countEl) countEl.textContent = list.length;
  }

  // Question text alone is not unique (two English items share it), so the
  // correct answer is part of the key.
  function quizKey(quiz) {
    var q = quiz.querySelector(".quiz-q");
    var ok = quiz.querySelector('.quiz-option[data-correct="true"]');
    return (q ? q.textContent.replace(/^\d+\.\s*/, "").trim() : "") + " | " + (ok ? ok.textContent.trim() : "");
  }

  function recordAnswer(quiz, isCorrect) {
    var key = quizKey(quiz);
    var list = loadErrors().filter(function (k) { return k !== key; });
    if (!isCorrect) list.push(key);
    saveErrors(list);
  }

  function keepOnlyErrors() {
    var round = document.getElementById("quiz-round");
    if (!round || !/[?&]errori\b/.test(location.search)) return;
    var saved = loadErrors();
    round.querySelectorAll(".quiz-unit").forEach(function (unit) {
      var quiz = unit.querySelector("[data-quiz]");
      if (!quiz || saved.indexOf(quizKey(quiz)) === -1) unit.remove();
    });
    round.querySelectorAll(".quiz-q").forEach(function (q, idx) {
      q.textContent = (idx + 1) + ". " + q.textContent.replace(/^\d+\.\s*/, "");
    });
    var h1 = document.querySelector("h1");
    if (h1) h1.textContent = "Ripasso errori";
    var sub = document.querySelector(".subtitle");
    if (sub) sub.textContent = "Solo le domande sbagliate finora (" + round.querySelectorAll("[data-quiz]").length + "). Una risposta giusta toglie la domanda dall'elenco; ricarica la pagina per rifare quelle rimaste.";
    if (!round.querySelector("[data-quiz]")) round.innerHTML = "<p>Nessun errore salvato. Sbaglia qualche domanda nelle lezioni o nel quiz generale e tornerà qui.</p>";
  }

  function updateScore() {
    var scoreEl = document.getElementById("lesson-quiz-score");
    if (!scoreEl) return;
    var answered = document.querySelectorAll(".quiz[data-answered]").length;
    var correct = document.querySelectorAll(".quiz[data-answered=\"correct\"]").length;
    scoreEl.textContent = correct + " / " + answered + " risposte corrette al primo tentativo";
  }

  function shuffleOptions(quiz) {
    var container = quiz.querySelector(".quiz-options");
    if (!container) return;
    var options = Array.prototype.slice.call(container.querySelectorAll(".quiz-option"));
    for (var i = options.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = options[i];
      options[i] = options[j];
      options[j] = tmp;
    }
    options.forEach(function (btn) { container.appendChild(btn); });
  }

  function wireQuiz(quiz) {
    shuffleOptions(quiz);
    var options = quiz.querySelectorAll(".quiz-option");
    var feedback = quiz.querySelector("[data-feedback]");
    var explain = quiz.querySelector("[data-explain]");

    options.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (quiz.hasAttribute("data-answered")) return;

        var isCorrect = btn.getAttribute("data-correct") === "true";
        quiz.setAttribute("data-answered", isCorrect ? "correct" : "incorrect");

        options.forEach(function (b) {
          b.disabled = true;
          if (b.getAttribute("data-correct") === "true") {
            b.classList.add("correct");
          } else if (b === btn) {
            b.classList.add("incorrect");
          }
        });

        if (feedback) {
          feedback.textContent = isCorrect
            ? "Corretto."
            : "Non corretto — la risposta giusta è evidenziata sopra.";
          feedback.classList.add(isCorrect ? "correct" : "incorrect");
        }

        if (explain) explain.classList.add("shown");

        recordAnswer(quiz, isCorrect);
        updateScore();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    keepOnlyErrors();
    document.querySelectorAll("[data-quiz]").forEach(wireQuiz);
    saveErrors(loadErrors());
    updateScore();
  });
})();
