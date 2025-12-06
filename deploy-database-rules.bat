@echo off
echo Deploying Firebase Realtime Database Rules...
echo.

REM Deploy database rules only
firebase deploy --only database

echo.
echo Database rules deployment complete!
echo.
pause
