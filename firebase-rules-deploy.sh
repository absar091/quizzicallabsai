#!/bin/bash
echo "🎯 Deploying updated Firebase Database Rules..."
echo ""

# Deploy database rules
firebase deploy --only database:rules

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Firebase Databases Rules successfully deployed!"
    echo "🎉 Quiz submission permissions are now fixed!"
    echo ""
    echo "Key improvements:"
    echo "• Quiz results can now be saved to Realtime Database"
    echo "• Proper validation for quiz result documents"
    echo "• Better indexing for quiz queries"
    echo "• Support for nested quiz result structure"
else
    echo ""
    echo "❌ Failed to deploy Firebase Database Rules"
    echo "Please check your Firebase CLI setup and try again"
fi
