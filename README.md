# Shenma Live Web

PC Web sports live platform prototype. All modules are developed and previewed from this single Git project.

## Run locally

```bash
pnpm dev
```

Open `http://127.0.0.1:4173/`.

The Vite server is fixed to `127.0.0.1:4173` with `strictPort: true`. If the port is already occupied, first check whether the canonical Shenma Live development server is running and reuse it. Never allow Vite to select another port.

See [PREVIEW.md](./PREVIEW.md) for the canonical preview and route policy.

## Structure

- `index.html` — application shell
- `src/data.js` — sports, live room and standings mock data
- `src/app.js` — reusable view components and interactions
- `src/styles.css` — responsive desktop-first visual system
