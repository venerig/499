// Randomizes question order on every page load for a full quiz round.
//
// Markup contract:
// <div id="quiz-round">
//   <div class="quiz-unit"> ... optional context ... <div class="quiz" data-quiz>...</div> </div>
//   <div class="quiz-unit"> <div class="quiz" data-quiz>...</div> </div>
//   ...
// </div>
//
// Each .quiz-unit is shuffled as a whole (so a reading passage stays glued
// to its question), then every ".quiz-q" is renumbered 1..N to match the
// new order. Runs before assets/quiz.js, which only cares about each
// .quiz block individually and is unaffected by reordering its container.

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById("quiz-round");
    if (!container) return;

    var units = Array.prototype.slice.call(container.children).filter(function (el) {
      return el.classList.contains("quiz-unit");
    });

    for (var i = units.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = units[i];
      units[i] = units[j];
      units[j] = tmp;
    }
    units.forEach(function (unit) { container.appendChild(unit); });

    var questions = container.querySelectorAll(".quiz-q");
    questions.forEach(function (q, idx) {
      q.textContent = (idx + 1) + ". " + q.textContent.replace(/^\d+\.\s*/, "");
    });
  });
})();
