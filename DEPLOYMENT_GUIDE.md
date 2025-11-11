# 🚀 Deployment Guide - Vyper Launcher

This guide will walk you through updating your GitHub repository and deploying to Vercel.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] Git installed on your Ubuntu machine
- [ ] GitHub account with your repository
- [ ] Pinata account (free tier is fine) - [Sign up here](https://www.pinata.cloud)
- [ ] Vercel account - [Sign up here](https://vercel.com)

---

## Part 1: Get Pinata API Keys (5 minutes)

### Step 1: Sign up for Pinata
1. Go to https://www.pinata.cloud
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Generate API Keys
1. Log in to Pinata dashboard
2. Click on "API Keys" in the left sidebar
3. Click "New Key" button
4. Configure the key:
   - Enable "pinFileToIPFS" permission
   - Enable "pinJSONToIPFS" permission
   - Give it a name like "Vyper Launcher"
5. Click "Create Key"
6. **IMPORTANT:** Copy both the API Key and API Secret immediately (you won't see the secret again!)
7. Save them somewhere safe - you'll need them soon

---

## Part 2: Update Your GitHub Repository

### Step 1: Navigate to Your Project
Open your Ubuntu terminal and navigate to your project:

```bash
cd /path/to/your/vyper-launcher-repo
```

### Step 2: Check Current Status
```bash
git status
```

### Step 3: Backup Current Code (Optional but Recommended)
```bash
# Create a backup branch
git checkout -b backup-old-version
git push origin backup-old-version

# Go back to main branch
git checkout main
```

### Step 4: Download All New Files

You have two options:

#### Option A: Download the optimized files from Claude
I've created all the files in `/home/claude/vyper-launcher-optimized/`. You can download them.

#### Option B: Replace files manually
1. Delete old files (keep .git folder):
```bash
# Backup your .git folder first!
rm -rf * .gitignore .env*
# Keep only .git folder
```

2. Copy all new files from the optimized folder into your repo directory

### Step 5: Create .env.local File
Create a `.env.local` file with your Pinata keys:

```bash
cat > .env.local << EOF
# Solana Network Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Pinata API Keys
VITE_PINATA_API_KEY=YOUR_PINATA_API_KEY_HERE
VITE_PINATA_SECRET_KEY=YOUR_PINATA_SECRET_KEY_HERE
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
EOF
```

Replace `YOUR_PINATA_API_KEY_HERE` and `YOUR_PINATA_SECRET_KEY_HERE` with your actual keys from Part 1.

### Step 6: Install Dependencies
```bash
npm install
```

### Step 7: Test Locally
```bash
npm run dev
```

Open http://localhost:3000 and test:
1. Connect your Phantom wallet
2. Fill out the form
3. Try creating a test token (on devnet)

If everything works, proceed to push to GitHub.

### Step 8: Commit and Push to GitHub
```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "feat: Add real Solana integration with IPFS uploads

- Integrate Solana wallet adapter for real wallet connections
- Add SPL token creation with authority revocation
- Implement IPFS uploads via Pinata
- Add production-ready error handling
- Optimize for Vercel deployment"

# Push to GitHub
git push origin main
```

If you get any errors about divergent branches:
```bash
git pull origin main --rebase
git push origin main
```

---

## Part 3: Deploy to Vercel

### Step 1: Sign Up for Vercel
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository
1. From Vercel dashboard, click "Add New" → "Project"
2. Find your `vyper-launcher` repository
3. Click "Import"

### Step 3: Configure Project Settings

#### Framework Preset
- Vercel should auto-detect "Vite"
- If not, select "Vite" from the dropdown

#### Build Settings
- Build Command: `npm run build` (should be auto-filled)
- Output Directory: `dist` (should be auto-filled)
- Install Command: `npm install` (should be auto-filled)

### Step 4: Add Environment Variables

**CRITICAL STEP - Don't skip this!**

Click "Environment Variables" and add the following:

1. **VITE_SOLANA_NETWORK**
   - Value: `devnet` (for testing) or `mainnet-beta` (for production)

2. **VITE_SOLANA_RPC_URL**
   - Value: `https://api.devnet.solana.com` (for testing)
   - For production, use a dedicated RPC from QuickNode or Helius

3. **VITE_PINATA_API_KEY**
   - Value: Your Pinata API Key from Part 1

4. **VITE_PINATA_SECRET_KEY**
   - Value: Your Pinata API Secret from Part 1

5. **VITE_PINATA_GATEWAY**
   - Value: `https://gateway.pinata.cloud/ipfs/`

### Step 5: Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. Once complete, you'll see a success screen with your live URL

### Step 6: Test Your Live Site
1. Click "Visit" to open your deployed site
2. Test the full flow:
   - Connect wallet
   - Create a test token on devnet
   - Verify it appears on Solscan

---

## Part 4: Switch to Mainnet (When Ready)

⚠️ **WARNING:** Mainnet uses real SOL. Test thoroughly on devnet first!

### Step 1: Get Production RPC Endpoint

Free options:
- **QuickNode**: https://www.quicknode.com (free 500k requests/mo)
- **Helius**: https://www.helius.dev (free tier)

1. Sign up for an account
2. Create a new endpoint for Solana Mainnet
3. Copy the HTTPS RPC URL

### Step 2: Update Vercel Environment Variables
1. Go to your Vercel project
2. Settings → Environment Variables
3. Edit these variables:
   - `VITE_SOLANA_NETWORK` → `mainnet-beta`
   - `VITE_SOLANA_RPC_URL` → Your production RPC URL
4. Click "Save"

### Step 3: Redeploy
1. Go to Deployments tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Your site will update with mainnet configuration

---

## 🎉 You're Live!

Your Vyper Launcher is now deployed and functional!

### What You Can Do Now:
- Share your Vercel URL with users
- Create real tokens on Solana
- Launch liquidity pools on Raydium
- Monitor usage in Vercel analytics

### Next Steps:
- Add a custom domain in Vercel settings
- Set up analytics tracking
- Monitor Pinata usage
- Consider upgrading RPC for higher traffic

---

## 🐛 Troubleshooting

### "Module not found" errors during build
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Update dependencies"
git push origin main
```

### Environment variables not working
- Make sure they start with `VITE_`
- Redeploy after adding variables
- Check spelling exactly matches `.env.local`

### Build fails on Vercel
- Check the build logs in Vercel dashboard
- Make sure all files are committed to GitHub
- Verify package.json has all dependencies

### Can't connect wallet on deployed site
- Check browser console for errors
- Make sure you're using HTTPS (Vercel provides this automatically)
- Try a different wallet if one doesn't work

---

## 📞 Need Help?

If you run into issues:
1. Check the error messages in terminal/Vercel logs
2. Verify all environment variables are set correctly
3. Test locally first with `npm run dev`
4. Check that your Pinata API keys are valid

---

**Made with 🐍 by Vyper Launcher Team**
