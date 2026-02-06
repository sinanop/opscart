# Project Setup and Run Instructions

It looks like you are setting up the project for the first time or the dependencies are missing. Here is how to get everything running.

## 🛑 Important: internal `json-server`
Please **STOP** running `npx json-server`. We have built a real Node.js/Express backend that replaces it. Running both on port 5000 will cause conflicts.
Close the terminal window where `json-server` is running or press `CTRL+C` to stop it.

## 1. Install Frontend Dependencies
Your error `'vite' is not recognized` happens because the frontend dependencies are not installed yet.

1. Open a terminal in the root folder (`c:\Users\DELL\Desktop\carinfo.in`).
2. Run the following command:
   ```bash
   npm install
   ```
   *This will create a `node_modules` folder and install Vite, React, etc.*

## 2. Start the Backend Server
The backend handles the database and API calls.

1. Open a **new** terminal.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Install backend dependencies (if not already done):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node index.js
   ```
   *You should see: `🚀 Server is running on port 5000` and `✅ MongoDB connected successfully`.*
   *(Note: You need MongoDB installed locally, or update `backend/index.js` with your cloud URI)*

## 3. Start the Frontend
1. Go back to your first terminal (root folder `carinfo.in`).
2. Run:
   ```bash
   npm run dev
   ```
   *This will start the React app, usually on http://localhost:5173.*

## Summary of Terminals
- **Terminal 1 (Backend):** `cd backend` -> `node index.js` (Runs on port 5000)
- **Terminal 2 (Frontend):** `npm run dev` (Runs on port 5173, proxies /api to 5000)
