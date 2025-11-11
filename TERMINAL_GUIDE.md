# 🖥️ Ubuntu Terminal Guide - Update Your GitHub Repo

Follow these commands in your Ubuntu terminal to update your vyper-launcher repository.

## 📥 STEP 1: Download the Optimized Files

I've created all the optimized files with real Solana functionality. Download them to your machine.

### Option A: Download via Browser
1. Download the `vyper-launcher-optimized` folder from Claude
2. Extract it to a known location (e.g., ~/Downloads/vyper-launcher-optimized)

### Option B: You'll manually copy files I provide in this chat

---

## 📂 STEP 2: Navigate to Your Repository

```bash
# Replace with your actual path
cd ~/path/to/your/vyper-launcher

# Verify you're in the right place (should show .git directory)
ls -la
```

---

## 💾 STEP 3: Backup Your Current Code

```bash
# Check current status
git status

# Create backup branch
git checkout -b backup-old-version

# Push backup to GitHub
git push origin backup-old-version

# Return to main branch
git checkout main
```

---

## 🗑️ STEP 4: Remove Old Files (Keep .git)

```bash
# Remove old files but keep .git folder
# DO NOT delete .git folder!
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +

# Verify only .git remains
ls -la
```

---

## 📋 STEP 5: Copy New Files

```bash
# If you downloaded to ~/Downloads/vyper-launcher-optimized
# Copy all files from the optimized folder to your repo

cp -r ~/Downloads/vyper-launcher-optimized/* .
cp -r ~/Downloads/vyper-launcher-optimized/.* . 2>/dev/null || true

# Verify files are copied
ls -la
```

---

## 🔐 STEP 6: Set Up Environment Variables

### Get Pinata API Keys First
1. Go to https://www.pinata.cloud
2. Sign up (free tier is fine)
3. Go to API Keys section
4. Click "New Key"
5. Enable "pinFileToIPFS" and "pinJSONToIPFS"
6. Copy your API Key and Secret

### Create .env.local File

```bash
# Create the .env.local file with your Pinata keys
cat > .env.local << 'EOF'
# Solana Network Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Pinata API Keys - REPLACE WITH YOUR ACTUAL KEYS
VITE_PINATA_API_KEY=YOUR_PINATA_API_KEY_HERE
VITE_PINATA_SECRET_KEY=YOUR_PINATA_SECRET_KEY_HERE
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
EOF

# Now edit the file and replace YOUR_PINATA_API_KEY_HERE with your actual keys
nano .env.local
# Press Ctrl+X, then Y, then Enter to save
```

---

## 📦 STEP 7: Install Dependencies

```bash
# Install all npm dependencies
npm install

# This will take 2-3 minutes
# You should see "added XXX packages"
```

---

## 🧪 STEP 8: Test Locally

```bash
# Start development server
npm run dev

# You should see:
# "Local: http://localhost:3000"
```

Open http://localhost:3000 in your browser and test:
1. ✅ Connect your Phantom/Solflare wallet
2. ✅ Fill out the token form
3. ✅ Create a test token on devnet
4. ✅ Verify it works!

Press `Ctrl+C` in terminal to stop the server when done testing.

---

## 🚀 STEP 9: Push to GitHub

```bash
# Check what files changed
git status

# Add all files
git add .

# Commit with descriptive message
git commit -m "feat: Add real Solana integration with IPFS uploads

- Integrate Solana wallet adapter for real wallet connections
- Add SPL token creation with authority revocation
- Implement IPFS uploads via Pinata
- Add production-ready error handling
- Optimize for Vercel deployment
- Update all dependencies for production"

# Push to GitHub
git push origin main
```

### If you get "divergent branches" error:
```bash
git pull origin main --rebase
git push origin main
```

---

## ✅ STEP 10: Verify on GitHub

1. Go to your GitHub repository in a browser
2. Refresh the page
3. Verify you see all the new files:
   - package.json (updated)
   - App.tsx (updated)
   - New folders: lib/, utils/, hooks/
   - New files: DEPLOYMENT_GUIDE.md, README.md, etc.

---

## 🎉 Success!

Your GitHub repository is now updated with the optimized code!

## 🌐 Next: Deploy to Vercel

Follow these steps:

```bash
# Option 1: Use Vercel CLI
npm install -g vercel
vercel

# Option 2: Deploy via GitHub (Recommended)
```

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Add environment variables:
   - `VITE_SOLANA_NETWORK` = `devnet`
   - `VITE_SOLANA_RPC_URL` = `https://api.devnet.solana.com`
   - `VITE_PINATA_API_KEY` = your Pinata API key
   - `VITE_PINATA_SECRET_KEY` = your Pinata secret
   - `VITE_PINATA_GATEWAY` = `https://gateway.pinata.cloud/ipfs/`
5. Click "Deploy"
6. Wait 2-3 minutes
7. Your site is live! 🎉

---

## 🐛 Troubleshooting

### "npm install" fails
```bash
# Clear cache and try again
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### "git push" rejected
```bash
# Force push (only if you're sure)
git push origin main --force

# Or rebase first
git pull origin main --rebase
git push origin main
```

### Can't find .env.local
```bash
# Make sure you created it in the project root
ls -la | grep .env

# If it doesn't exist, create it again
cat > .env.local << 'EOF'
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PINATA_API_KEY=your_key_here
VITE_PINATA_SECRET_KEY=your_secret_here
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
EOF
```

### Files not copying correctly
```bash
# Make sure you're in the repo directory
pwd

# Should show something like: /home/yourusername/vyper-launcher

# Try copying with verbose output
cp -rv ~/Downloads/vyper-launcher-optimized/* .
```

---

## 📚 Documentation Files

After updating, you'll have these helpful guides:

- `README.md` - Project overview and features
- `DEPLOYMENT_GUIDE.md` - Complete deployment walkthrough
- `SETUP_CHECKLIST.md` - Track your progress
- `FILE_STRUCTURE.md` - File organization reference

---

## 🆘 Need Help?

If you get stuck:
1. Read the error message carefully
2. Check DEPLOYMENT_GUIDE.md for detailed help
3. Verify all files copied correctly
4. Make sure .env.local has your actual Pinata keys
5. Test locally before pushing to GitHub

---

## ⚡ Quick Reference

```bash
# Common commands you'll use

# Check git status
git status

# See what changed
git diff

# Undo changes (before commit)
git checkout -- .

# View commit history
git log --oneline

# Check node/npm versions
node --version
npm --version

# Clean install
rm -rf node_modules package-lock.json && npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**Made with 🐍 by Vyper Launcher Team**

**Ready to deploy?** → See DEPLOYMENT_GUIDE.md
**Need checklist?** → See SETUP_CHECKLIST.md
