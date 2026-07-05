/* ============================================================
   All your content lives here. To add a project or blog post,
   just add an object to the arrays below — no HTML editing needed.
   ============================================================ */

// Drop a PDF into the projects/ folder, then add an entry here, e.g.:
// {
//   title: "My Project",
//   description: "One or two sentences on what it does.",
//   tags: ["Math", "CS"],
//   links: [{ label: "PDF", url: "projects/my-project.pdf" }],
// },
const projects = [];

const posts = [];

/* ============================================================
   Rendering — you shouldn't need to touch anything below.
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
    list.appendChild(el("li", "posts-empty", "Nothing here yet."));
    return;
  }

  projects.forEach((p) => {
    const li = el("li", "card");

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
    li.appendChild(h3);

    li.appendChild(el("p", null, p.description));

    const meta = el("div", "card-meta");
    (p.tags || []).forEach((t) => meta.appendChild(el("span", "tag", t)));

    if (p.links && p.links.length) {
      const links = el("div", "card-links");
      p.links.forEach((l) => {
        const a = el("a", null, l.label);
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noopener";
        links.appendChild(a);
      });
      meta.appendChild(links);
    }

    li.appendChild(meta);
    list.appendChild(li);
  });
}

function renderPosts() {
  const list = document.getElementById("post-list");
  if (!list) return;

  if (!posts.length) {
    list.appendChild(el("li", "posts-empty", "Nothing here yet — first post coming soon."));
    return;
  }

  // newest first
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  sorted.forEach((p) => {
    const li = el("li", "post");

    const time = document.createElement("time");
    time.dateTime = p.date;
    time.textContent = new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    li.appendChild(time);

    const wrap = el("div");
    const a = el("a", "post-title", p.title);
    a.href = p.url;
    wrap.appendChild(a);
    if (p.summary) wrap.appendChild(el("span", "post-summary", p.summary));
    li.appendChild(wrap);

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
