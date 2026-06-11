// Single source of truth for where the backend lives. Server-side only.
// Set BACKEND_URL in .env.local (dev) or the deployment environment, e.g.
// BACKEND_URL=https://api.yourdomain.com
export const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:8000").replace(/\/+$/, "");
