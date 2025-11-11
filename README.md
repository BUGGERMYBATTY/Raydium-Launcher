<<<<<<< HEAD
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
=======
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1IZtq-ddi1Gxa9P_hv137dhhnpTaFbdHZ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
