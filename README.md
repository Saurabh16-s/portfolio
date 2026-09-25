# saurabh.dev — Portfolio

A dark, terminal-style developer portfolio built with React + Vite + Tailwind CSS,
featuring a playable pixel football game: score a goal and unlock a random fact.

## Structure

```
saurabh-portfolio/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   ├── facts.js        # edit: facts shown when a goal is scored
    │   ├── projects.js     # edit: your real project links
    │   └── techStack.js    # edit: your stack
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── PixelFootballGame.jsx   # the game — canvas + game loop
        ├── About.jsx
        ├── TechStack.jsx
        ├── Projects.jsx
        ├── GithubActivity.jsx     # static mock — wire to real GitHub API later
        └── Footer.jsx
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Vercel auto-detects Vite — no config needed. Click Deploy.

Or with the CLI:

```bash
npm i -g vercel
vercel
```

## Customizing

- **Facts on goal**: edit `src/data/facts.js` — a new one shows every time you score.
- **Projects**: edit `src/data/projects.js` with your real repo/demo links.
- **GitHub activity**: `GithubActivity.jsx` currently renders mock data. To make
  it live, either call the GitHub GraphQL API from a small serverless function
  (recommended, keeps your token off the client) or use a public contribution
  API and fetch client-side.
- **Colors/fonts**: `tailwind.config.js` (`accent` color) and `src/index.css`.

## Game controls

Click the game canvas to focus it, then use Arrow Keys or WASD to move.
Walk into the ball to kick it — get it into either goal to score.
