(function () {
  var input = document.getElementById("search-input");
  var resultsBox = document.getElementById("search-results");
  var index = window.__WIKI_SEARCH_INDEX__ || [];

  if (!input || !resultsBox) return;

  function render(matches, query) {
    if (!matches.length) {
      resultsBox.innerHTML = '<div class="no-results">No pages match "' + escapeHtml(query) + '".</div>';
      resultsBox.classList.remove("hidden");
      return;
    }
    resultsBox.innerHTML = matches
      .map(function (m) {
        return (
          '<a href="' + m.href + '">' +
          '<span class="result-title">' + escapeHtml(m.title) + "</span>" +
          '<span class="result-snippet">' + escapeHtml(m.snippet) + "</span>" +
          "</a>"
        );
      })
      .join("");
    resultsBox.classList.remove("hidden");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function snippetAround(text, query) {
    var i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text.slice(0, 100) + "...";
    var start = Math.max(0, i - 40);
    var end = Math.min(text.length, i + query.length + 60);
    return (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");
  }

  function search(query) {
    var q = query.trim().toLowerCase();
    if (!q) {
      resultsBox.classList.add("hidden");
      resultsBox.innerHTML = "";
      return;
    }
    var matches = index
      .map(function (page) {
        var titleHit = page.title.toLowerCase().includes(q);
        var textHit = page.text.toLowerCase().includes(q);
        if (!titleHit && !textHit) return null;
        var score = (titleHit ? 10 : 0) + (textHit ? 1 : 0);
        var snippet = titleHit ? page.summary || page.text.slice(0, 100) : snippetAround(page.text, q);
        return { title: page.title, href: page.href, snippet: snippet, score: score };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, 8);
    render(matches, query);
  }

  input.addEventListener("input", function () {
    search(input.value);
  });

  document.addEventListener("click", function (e) {
    if (!resultsBox.contains(e.target) && e.target !== input) {
      resultsBox.classList.add("hidden");
    }
  });
})();
