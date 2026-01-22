#!/bin/bash

echo "🚀 Shopify Business Case - GitHub & Vercel Deployment"
echo "======================================================"
echo ""

# Check if GitHub remote is set
if git remote get-url origin &> /dev/null; then
    echo "✅ GitHub remote already configured"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Remote: $REMOTE_URL"
else
    echo "⚠️  GitHub remote not configured yet"
    echo ""
    echo "Please create a GitHub repository first:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a new repository (public or private)"
    echo "3. Copy the repository URL"
    echo ""
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REPO_URL
    
    if [ -n "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        echo "✅ Remote added: $REPO_URL"
    else
        echo "❌ No URL provided. Exiting."
        exit 1
    fi
fi

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎯 Next Steps:"
    echo ""
    echo "📱 FRONTEND (Deploy to Vercel):"
    echo "   1. Go to https://vercel.com"
    echo "   2. Click 'Add New...' → 'Project'"
    echo "   3. Import your GitHub repository"
    echo "   4. Set Root Directory: 'app'"
    echo "   5. Click 'Deploy'"
    echo ""
    echo "🔧 BACKEND (Deploy to Railway):"
    echo "   1. Go to https://railway.app"
    echo "   2. Click 'New Project' → 'Deploy from GitHub'"
    echo "   3. Select your repository"
    echo "   4. Set Root Directory: 'backend'"
    echo "   5. Add PostgreSQL and Redis databases"
    echo "   6. Set environment variables (see DEPLOYMENT_GUIDE.md)"
    echo ""
    echo "📚 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
    echo ""
else
    echo ""
    echo "❌ Push failed. Please check your credentials and try again."
    echo ""
    echo "You can manually push with:"
    echo "   git push -u origin main"
    echo ""
fi
