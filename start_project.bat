@echo off
echo Starting CarInfo Project...

echo Starting Backend...
start "CarInfo Backend" cmd /k "cd backend && npm start"

echo Starting Frontend...
start "CarInfo Frontend" cmd /k "npm run dev"

echo Done! Both servers are launching in separate windows.
pause
