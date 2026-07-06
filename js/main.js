/* ============================================================
   Content data lives in js/data.js (shared with alt/).
   ============================================================ */

/* ============================================================
   Rendering — you shouldn't need to touch anything below.
   ============================================================ */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

const EXT_ICON =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M14 3a1 1 0 1 0 0 2h3.59l-8.3 8.3a1 1 0 1 0 1.42 1.4L19 6.41V10a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-6zM5 7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4a1 1 0 1 0-2 0v4H5V9h4a1 1 0 0 0 0-2H5z"/></svg>';

function renderProjects() {
  const list = document.getElementById("project-list");
  if (!list) return;

  if (!projects.length) {
    list.appendChild(el("li", "list-empty", "Nothing here yet — projects coming soon."));
    return;
  }

  projects.forEach((p) => {
    const li = el("li", "card");
    const mainLink = p.links && p.links[0];

    const top = el("div", "card-top");
    top.appendChild(el("span", "card-tile", p.title.charAt(0).toUpperCase()));
    if (mainLink) {
      const ext = el("a", "card-ext");
      ext.href = mainLink.url;
      ext.target = "_blank";
      ext.rel = "noopener";
      ext.setAttribute("aria-label", `Open ${p.title}`);
      ext.innerHTML = EXT_ICON;
      top.appendChild(ext);
    }
    li.appendChild(top);

    const h3 = el("h3");
    if (mainLink) {
      const a = el("a", null, p.title);
      a.href = mainLink.url;
      a.target = "_blank";
      a.rel = "noopener";
      h3.appendChild(a);
    } else {
      h3.textContent = p.title;
    }
    li.appendChild(h3);

    li.appendChild(el("p", null, p.description));

    if (p.tags && p.tags.length) {
      const tags = el("div", "card-tags");
      p.tags.forEach((t) => tags.appendChild(el("span", "tag", t)));
      li.appendChild(tags);
    }

    list.appendChild(li);
  });
}

function renderNotes() {
  const list = document.getElementById("note-list");
  if (!list) return;

  if (!notes.length) {
    list.appendChild(el("li", "list-empty", "Nothing here yet — notes coming soon."));
    return;
  }

  // newest first
  const sorted = [...notes].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  sorted.forEach((n) => {
    const li = el("li", "stack-item");

    const head = el("div", "stack-head");
    const h3 = el("h3");
    const a = el("a", null, n.title);
    a.href = n.url;
    a.target = "_blank";
    a.rel = "noopener";
    h3.appendChild(a);
    head.appendChild(h3);

    const meta = el("span", "stack-meta");
    if (n.course) {
      const tag = el("span", "tag", n.course);
      meta.appendChild(tag);
      meta.appendChild(document.createTextNode(" "));
    }
    if (n.date) {
      const time = document.createElement("time");
      time.dateTime = n.date;
      time.textContent = new Date(n.date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      meta.appendChild(time);
    }
    head.appendChild(meta);
    li.appendChild(head);

    if (n.description) li.appendChild(el("p", "stack-desc", n.description));

    list.appendChild(li);
  });
}

function renderPosts() {
  const list = document.getElementById("post-list");
  if (!list) return;

  if (!posts.length) {
    list.appendChild(el("li", "list-empty", "Nothing here yet — first post coming soon."));
    return;
  }

  // newest first
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  sorted.forEach((p) => {
    const li = el("li", "stack-item");

    const head = el("div", "stack-head");
    const h3 = el("h3");
    const a = el("a", null, p.title);
    a.href = p.url;
    h3.appendChild(a);
    head.appendChild(h3);

    const time = document.createElement("time");
    time.className = "stack-meta";
    time.dateTime = p.date;
    time.textContent = new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    head.appendChild(time);
    li.appendChild(head);

    if (p.summary) li.appendChild(el("p", "stack-desc", p.summary));

    list.appendChild(li);
  });
}

/* Highlight the nav link for the section currently in view.
   Skips non-hash links (e.g. the mailto: contact entry). */
function setupNavHighlight() {
  const links = [...document.querySelectorAll(".nav-links a")].filter((a) =>
    a.getAttribute("href").startsWith("#")
  );
  const sections = links.map((a) =>
    document.querySelector(a.getAttribute("href"))
  );

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => s && observer.observe(s));
}

/* Manual light/dark toggle — defaults to system preference, then remembers your choice */
function setupThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  function currentTheme() {
    return (
      document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    button.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  applyTheme(currentTheme());

  button.addEventListener("click", () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderProjects();
renderNotes();
renderPosts();
setupNavHighlight();
setupThemeToggle();
