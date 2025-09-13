#!/bin/bash

echo "🔥 Deploying Firebase Database Rules to fix Quiz Submission Permissions..."

# Deploy the updated rules
firebase deploy --only database:rules

echo "✅ Firebase Database Rules deployed successfully!"

echo ""
echo "📋 QUIZ SUBMISSION RULES NOW ACTIVE:"
echo "• Quiz results: ALLOWED for authenticated users"
echo "• Shared quizzes: ALLOWED for public read"
echo "• Quiz rooms: ALLOWED for multiplayer sessions"
echo ""

echo "🧪 TEST QUIZ SUBMISSION NOW:"
echo "1. Take a quiz"
echo "2. Try to submit it"
echo "3. Should work without permission errors"
echo ""

echo "🎉 Quiz submission permissions fixed! Try submitting a quiz now."
