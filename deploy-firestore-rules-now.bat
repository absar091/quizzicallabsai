@echo off
echo 🔥 Deploying Quiz Arena Firebase Rules...
echo.
echo IMPORTANT: Make sure you have Firebase CLI installed and are logged in
echo Run: npm install -g firebase-tools
echo Run: firebase login
echo.
pause
echo.
echo Deploying Firestore rules...
firebase deploy --only firestore:rules
echo.
echo ✅ Rules deployment complete!
echo.
echo Next steps:
echo 1. Test the Quiz Arena at /quiz-arena/diagnostics
echo 2. Try creating a new quiz arena
echo 3. Test participant joining
echo.
pause