#!/bin/bash

# Deploy Firestore Security Rules
# This script deploys the updated Firestore rules to fix login credentials permissions

echo "🔥 Deploying Firestore Security Rules..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase first:"
    echo "firebase login"
    exit 1
fi

# Deploy the rules
echo "📤 Deploying Firestore rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ Firestore rules deployed successfully!"
    echo "🔑 Login credentials permissions have been updated"
    echo "🛡️ Security rules are now active"
else
    echo "❌ Failed to deploy Firestore rules"
    echo "Please check your Firebase configuration and try again"
    exit 1
fi

echo "🎉 Deployment complete!"