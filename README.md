# Personal site

A minimal, single-page personal site (About / Projects / Writing) in plain HTML, CSS, and JS. No build step — just push to your GitHub Pages repo.

## Structure

```
index.html          the whole site (About, Projects, Writing sections)
css/style.css       all styling; theme colors are CSS variables at the top
js/main.js          your projects + writing posts live in two arrays here
posts/              one HTML file per writing post (duplicate first-post.html)
img/                (create this) put avatar.jpg here if you want a photo
```

## Quick customization checklist

1. **index.html** — replace every "Your Name", the tagline, bio, email, and the GitHub/LinkedIn URLs (search for `yourusername`).
2. **js/main.js** — edit the `projects` and `posts` arrays. Adding an entry is all it takes; the page renders them automatically. Posts are sorted newest-first by date.
3. **Photo (optional)** — add `img/avatar.jpg` and uncomment the `<img class="avatar">` line in index.html.
4. **Colors** — tweak the CSS variables at the top of `css/style.css` (there's a separate dark-mode block; the site follows the visitor's system theme automatically).

## Writing a new post

1. Copy `posts/first-post.html` to `posts/my-new-post.html` and edit the title, date, and body.
2. Add an entry to the `posts` array in `js/main.js`:

```js
{
  date: "2026-07-05",
  title: "My new post",
  summary: "One-line teaser (optional).",
  url: "posts/my-new-post.html",
},
```

## Deploying

Push these files to the root of your `yourusername.github.io` repo (or enable Pages on any repo). That's it — no build tools needed.
