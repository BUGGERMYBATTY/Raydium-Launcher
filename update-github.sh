#!/bin/bash

# Vyper Launcher - Quick Update Script
# This script helps you update your GitHub repository with the optimized code

set -e

echo "🐍 Vyper Launcher - GitHub Update Script"
echo "========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed"
    echo "Install it with: sudo apt install git"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    echo "Please run this script from your vyper-launcher repository root"
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Show current status
echo "📊 Current Git Status:"
git status --short
echo ""

# Ask for confirmation
read -p "⚠️  This will stage all changes. Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted"
    exit 1
fi

echo ""
echo "📦 Staging all changes..."
git add .

echo ""
echo "📝 Files staged:"
git status --short

echo ""
echo "💾 Committing changes..."
git commit -m "feat: Add real Solana integration with IPFS uploads

- Integrate Solana wallet adapter for real wallet connections
- Add SPL token creation with authority revocation
- Implement IPFS uploads via Pinata
- Add production-ready error handling
- Optimize for Vercel deployment
- Update dependencies for production use"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repository"
echo "3. Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo "4. Deploy!"
echo ""
echo "📖 Full deployment guide: DEPLOYMENT_GUIDE.md"
