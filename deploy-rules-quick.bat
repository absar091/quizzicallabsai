@echo off
echo 🔥 Deploying Firestore Rules...
firebase deploy --only firestore:rules
if %errorlevel% equ 0 (
    echo ✅ Firestore rules deployed successfully!
) else (
    echo ❌ Failed to deploy rules. Please check Firebase CLI setup.
)
pause