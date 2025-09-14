#!/bin/bash

echo "🔧 Fixing Quizzicallabs AI Application Issues..."

# Remove any remaining debug files
echo "🗑️ Cleaning up debug files..."
find src/app/api -name "*debug*" -type f -delete 2>/dev/null || true
find src/app/api -name "*diagnostic*" -type f -delete 2>/dev/null || true

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true

# Reinstall dependencies to fix any module issues
echo "📦 Reinstalling dependencies..."
npm install

echo "✅ App fixes completed!"
echo ""
echo "🚀 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Test quiz generation with a simple topic like 'Basic Math'"
echo "3. Check browser console for any remaining errors"
echo ""
echo "🔑 Make sure you have valid GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc. in your .env.local file"