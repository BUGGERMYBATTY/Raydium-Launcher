# ✅ Setup Checklist - Vyper Launcher

Use this checklist to track your progress setting up Vyper Launcher.

## Phase 1: Prerequisites (15 minutes)

### Accounts Setup
- [ ] GitHub account exists
- [ ] GitHub repository exists for vyper-launcher
- [ ] Pinata account created (https://www.pinata.cloud)
- [ ] Pinata API keys generated and saved
- [ ] Vercel account created (https://vercel.com)
- [ ] Vercel connected to GitHub

### Local Environment
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Phantom or Solflare wallet extension installed

---

## Phase 2: Update Repository (20 minutes)

### Backup Current Code
- [ ] Navigated to project directory: `cd /path/to/vyper-launcher`
- [ ] Created backup branch: `git checkout -b backup-old-version`
- [ ] Pushed backup: `git push origin backup-old-version`
- [ ] Returned to main: `git checkout main`

### Replace Files
- [ ] Downloaded optimized files from Claude
- [ ] Replaced all old files with new ones
- [ ] Verified all files are in place

### Configure Environment
- [ ] Created `.env.local` file
- [ ] Added `VITE_SOLANA_NETWORK=devnet`
- [ ] Added `VITE_SOLANA_RPC_URL=https://api.devnet.solana.com`
- [ ] Added `VITE_PINATA_API_KEY` with your actual key
- [ ] Added `VITE_PINATA_SECRET_KEY` with your actual secret
- [ ] Added `VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/`

### Install & Test
- [ ] Ran `npm install` (no errors)
- [ ] Ran `npm run dev` (started successfully)
- [ ] Opened http://localhost:3000 in browser
- [ ] Connected Phantom/Solflare wallet (worked)
- [ ] Filled out token form (validation works)
- [ ] Created test token on devnet (SUCCESS!)
- [ ] Verified token on Solscan

### Push to GitHub
- [ ] Staged changes: `git add .`
- [ ] Committed changes: `git commit -m "feat: Add real Solana integration"`
- [ ] Pushed to GitHub: `git push origin main`
- [ ] Verified on GitHub.com that files are updated

---

## Phase 3: Deploy to Vercel (15 minutes)

### Import Project
- [ ] Logged into Vercel dashboard
- [ ] Clicked "Add New" → "Project"
- [ ] Found vyper-launcher repository
- [ ] Clicked "Import"

### Configure Build
- [ ] Verified Framework Preset: "Vite"
- [ ] Verified Build Command: `npm run build`
- [ ] Verified Output Directory: `dist`
- [ ] Verified Install Command: `npm install`

### Add Environment Variables
- [ ] Added `VITE_SOLANA_NETWORK` = `devnet`
- [ ] Added `VITE_SOLANA_RPC_URL` = `https://api.devnet.solana.com`
- [ ] Added `VITE_PINATA_API_KEY` = (your key)
- [ ] Added `VITE_PINATA_SECRET_KEY` = (your secret)
- [ ] Added `VITE_PINATA_GATEWAY` = `https://gateway.pinata.cloud/ipfs/`

### Deploy & Test
- [ ] Clicked "Deploy"
- [ ] Build completed successfully (2-3 minutes)
- [ ] Clicked "Visit" to open live site
- [ ] Connected wallet on live site
- [ ] Created test token on live site
- [ ] Verified token appears on Solscan
- [ ] Copied deployment URL for sharing

---

## Phase 4: Production Setup (Optional - When Ready)

### Get Production RPC
- [ ] Signed up for QuickNode or Helius
- [ ] Created Solana Mainnet endpoint
- [ ] Copied HTTPS RPC URL
- [ ] Saved URL for next step

### Update to Mainnet
- [ ] Updated Vercel env: `VITE_SOLANA_NETWORK` = `mainnet-beta`
- [ ] Updated Vercel env: `VITE_SOLANA_RPC_URL` = (production RPC)
- [ ] Triggered redeploy in Vercel
- [ ] Tested on mainnet with small amount
- [ ] Verified on Solscan mainnet

### Optional Enhancements
- [ ] Added custom domain in Vercel
- [ ] Set up Vercel analytics
- [ ] Configured custom OG image
- [ ] Added Google Analytics (if desired)

---

## ⚠️ Important Notes

### Before Mainnet:
- ⚠️ Test EVERYTHING on devnet first
- ⚠️ Mainnet uses real SOL - you'll need ~0.01 SOL for fees
- ⚠️ Double-check all environment variables
- ⚠️ Verify Pinata has enough storage/bandwidth

### Security:
- ⚠️ NEVER commit `.env.local` to GitHub
- ⚠️ Keep your Pinata API keys secret
- ⚠️ Use a dedicated RPC for production (not public endpoints)

### Support:
- 📖 Full guide: `DEPLOYMENT_GUIDE.md`
- 📖 README: `README.md`
- 🐛 Issues: Check Vercel logs and browser console

---

## 🎉 Success Criteria

Your setup is complete when:
- ✅ Repository updated on GitHub with new code
- ✅ Deployed to Vercel with unique URL
- ✅ Can connect wallet on live site
- ✅ Can create tokens successfully
- ✅ Tokens appear on Solscan
- ✅ No errors in browser console
- ✅ No errors in Vercel logs

---

## 📊 Current Status

Mark your current phase:
- [ ] Phase 1: Prerequisites - IN PROGRESS
- [ ] Phase 2: Repository Update - NOT STARTED
- [ ] Phase 3: Vercel Deployment - NOT STARTED
- [ ] Phase 4: Production Setup - NOT STARTED

---

**Last Updated:** $(date)
**Next Step:** See DEPLOYMENT_GUIDE.md for detailed instructions

**Made with 🐍 by Vyper Launcher Team**
