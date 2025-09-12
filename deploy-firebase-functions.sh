#!/bin/bash
# 🔥 Quiz Arena Firebase Functions Deployment Script

set -e  # Exit on any error

echo "🚀 Deploying Quiz Arena Firebase Functions..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="your-project-id"  # Replace with your Firebase project ID
FUNCTIONS_DIR="functions"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found. Install with: npm install -g firebase-tools${NC}"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged into Firebase. Run: firebase login${NC}"
    exit 1
fi

# Login and select project
echo -e "${GREEN}🔐 Setting up Firebase project...${NC}"
firebase use $PROJECT_ID

# Enable required APIs
echo -e "${GREEN}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudfunctions.googleapis.com --project=$PROJECT_ID
gcloud services enable firestore.googleapis.com --project=$PROJECT_ID
gcloud services enable firebase.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID

# Deploy Firestore rules
echo -e "${GREEN}📝 Deploying Firestore security rules...${NC}"
firebase deploy --only firestore:rules

# Deploy Cloud Functions
echo -e "${GREEN}⚙️  Deploying Cloud Functions...${NC}"
firebase deploy --only functions

# Set up environment variables
echo -e "${GREEN}🌍 Setting up environment variables...${NC}"
firebase functions:config:set
  quiz.max_rooms="1000" \
  quiz.cleanup_hours="24" \
  security.max_answers_per_minute="10" \
  monitoring.alert_email="admin@yoursite.com"

# Deploy Realtime Database rules
echo -e "${GREEN}🗄️  Deploying Realtime Database rules...${NC}"
firebase deploy --only database

# Set up monitoring
echo -e "${GREEN}📊 Setting up monitoring...${NC}"
firebase functions:log

echo -e "${GREEN}✅ Quiz Arena deployment complete!${NC}"
echo ""
echo -e "${YELLOW}🔍 Check deployment status:${NC}"
echo "  firebase functions:list"
echo "  firebase functions:log --limit=50"
echo ""
echo -e "${YELLOW}📈 Monitor usage:${NC}"
echo "  https://console.cloud.google.com/functions/list?project=$PROJECT_ID"
echo ""
echo -e "${YELLOW}🚨 Security monitoring:${NC}"
echo "  Check Firebase Console > Functions > Logs for security violations"
echo ""
echo -e "${GREEN}🎯 Your Quiz Arena is ready for beta testing!${NC}"
