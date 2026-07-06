/* ============================================================
   Rendering for the alternate layout. Content comes from
   ../js/data.js (shared with the main site) — edit that file,
   not this one, to change projects or writing.
   ============================================================ */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderProjects() {
  const list = document.getElementById("project-list");
  if (!list) return;

  if (!projects.length) {
    list.appendChild(el("li", "row-empty", "Nothing here yet."));
    return;
  }

  projects.forEach((p) => {
    const li = el("li", "row");

    const head = el("div", "row-head");
    const h3 = el("h3");
    const mainLink = p.links && p.links[0];
    if (mainLink) {
      const a = el("a", null, p.title);
      a.href = mainLink.url;
      a.target = "_blank";
      a.rel = "noopener";
      h3.appendChild(a);
    } else {
      h3.textContent = p.title;
    }
    head.appendChild(h3);
    if (p.year) head.appendChild(el("span", "row-meta", p.year));
    li.appendChild(head);

    li.appendChild(el("p", "row-desc", p.description));

    if (p.tags && p.tags.length) {
      const tags = el("div", "row-tags");
      p.tags.forEach((t) => tags.appendChild(el("span", "tag", t)));
      li.appendChild(tags);
    }

    if (p.links && p.links.length) {
      const links = el("div", "row-links");
      p.links.forEach((l) => {
        const a = el("a", null, l.label);
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noopener";
        links.appendChild(a);
      });
      li.appendChild(links);
    }

    list.appendChild(li);
  });
}

/* Writing is grouped by year, newest year first — matches a "year headers
   above a flat list" reading pattern rather than one continuous feed. */
function renderPosts() {
  const meta = document.getElementById("writing-meta");
  const groups = document.getElementById("writing-groups");
  if (!groups) return;

  if (!posts.length) {
    if (meta) meta.textContent = "No posts yet.";
    const list = el("ul", "row-list");
    list.appendChild(el("li", "row-empty", "First post coming soon — check back later."));
    groups.appendChild(list);
    return;
  }

  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const firstYear = sorted[sorted.length - 1].date.slice(0, 4);
  if (meta) {
    meta.textContent = `${posts.length} post${posts.length === 1 ? "" : "s"} since ${firstYear}`;
  }

  const byYear = new Map();
  sorted.forEach((p) => {
    const y = p.date.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(p);
  });

  byYear.forEach((yearPosts, year) => {
    const section = el("div", "year-group");
    section.appendChild(el("h3", "year-label", year));

    const list = el("ul", "row-list");
    yearPosts.forEach((p) => {
      const li = el("li", "row");

      const head = el("div", "row-head");

      const time = document.createElement("time");
      time.className = "row-date";
      time.dateTime = p.date;
      time.textContent = new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      head.appendChild(time);

      const a = el("a", "row-post-title", p.title);
      a.href = p.url;
      head.appendChild(a);

      if (p.readTime) head.appendChild(el("span", "row-meta", `${p.readTime} →`));

      li.appendChild(head);
      if (p.summary) li.appendChild(el("p", "row-desc", p.summary));

      list.appendChild(li);
    });

    section.appendChild(list);
    groups.appendChild(section);
  });
}

/* Highlight the nav link for the section currently in view */
function setupNavHighlight() {
  const links = document.querySelectorAll(".nav-links a");
  const sections = [...links].map((a) =>
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

/* Cmd/Ctrl+K search palette — jumps to a section, project, or post */
function setupSearchPalette() {
  const trigger = document.getElementById("search-trigger");
  const backdrop = document.getElementById("search-backdrop");
  const palette = document.getElementById("search-palette");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!trigger || !palette || !input || !results) return;

  const index = [
    { label: "About", url: "#about", type: "section" },
    { label: "Projects", url: "#projects", type: "section" },
    { label: "Writing", url: "#writing", type: "section" },
    ...projects.map((p) => ({ label: p.title, url: (p.links && p.links[0] && p.links[0].url) || "#projects", type: "project" })),
    ...posts.map((p) => ({ label: p.title, url: p.url, type: "writing" })),
  ];

  let activeIndex = 0;

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    const matches = q
      ? index.filter((item) => item.label.toLowerCase().includes(q))
      : index;

    results.innerHTML = "";
    if (!matches.length) {
      results.appendChild(el("li", "search-empty", "No matches."));
      return;
    }

    matches.forEach((item, i) => {
      const li = el("li", "search-result" + (i === activeIndex ? " active" : ""));
      const a = el("a", null, item.label);
      a.href = item.url;
      li.appendChild(a);
      li.appendChild(el("span", "search-type", item.type));
      li.addEventListener("mouseenter", () => {
        activeIndex = i;
        renderResults(query);
      });
      results.appendChild(li);
    });
  }

  function open() {
    palette.hidden = false;
    backdrop.hidden = false;
    activeIndex = 0;
    input.value = "";
    renderResults("");
    input.focus();
  }

  function close() {
    palette.hidden = true;
    backdrop.hidden = true;
    trigger.focus();
  }

  trigger.addEventListener("click", open);
  backdrop.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palette.hidden ? open() : close();
    } else if (e.key === "Escape" && !palette.hidden) {
      close();
    }
  });

  input.addEventListener("input", () => {
    activeIndex = 0;
    renderResults(input.value);
  });

  input.addEventListener("keydown", (e) => {
    const items = results.querySelectorAll(".search-result");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      renderResults(input.value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderResults(input.value);
    } else if (e.key === "Enter") {
      const active = results.querySelector(".search-result.active a");
      if (active) {
        close();
        window.location.hash = active.getAttribute("href");
      }
    }
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderProjects();
renderPosts();
setupNavHighlight();
setupSearchPalette();
