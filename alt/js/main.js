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

function renderPosts() {
  const list = document.getElementById("post-list");
  if (!list) return;

  if (!posts.length) {
    list.appendChild(el("li", "row-empty", "Nothing here yet — first post coming soon."));
    return;
  }

  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  sorted.forEach((p) => {
    const li = el("li", "row");

    const head = el("div", "row-head");
    const a = el("a", null, p.title);
    a.href = p.url;
    head.appendChild(a);

    const time = document.createElement("time");
    time.className = "row-meta";
    time.dateTime = p.date;
    time.textContent = new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    head.appendChild(time);
    li.appendChild(head);

    if (p.summary) li.appendChild(el("p", "row-desc", p.summary));

    list.appendChild(li);
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

document.getElementById("year").textContent = new Date().getFullYear();
renderProjects();
renderPosts();
setupNavHighlight();
