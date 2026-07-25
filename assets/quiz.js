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

(function () {
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

        updateScore();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-quiz]").forEach(wireQuiz);
    updateScore();
  });
})();
