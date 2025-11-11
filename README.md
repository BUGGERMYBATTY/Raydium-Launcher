# Raydium-Launcher

Monorepo: Vite frontend + Express backend.
- Frontend dev: `npm run dev` (port 5173)
- Backend dev: `npx nodemon server.js` (port 3001)

## Environment
Copy `.env.example` files to `.env` in both `frontend/` and `backend/` and fill your secrets.

## Frontend
- `VITE_API_BASE` must point to the backend (e.g., `http://localhost:3001`).
- `VITE_TOKEN_DECIMALS` default is 9.

## Backend
- Use **PINATA_JWT** (preferred). ALLOWED_ORIGINS controls CORS.
