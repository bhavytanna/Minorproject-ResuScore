# 📌 Part 3 of 10 – Backend Server + File Upload API

## What This Part Demonstrates
- Node.js + Express + TypeScript backend server setup
- `POST /api/upload` endpoint that accepts PDF/DOCX files (via multer)
- `GET /api/health` endpoint confirming server is running
- Multer configuration: file type filtering, 5MB size limit, disk storage
- In-memory storage of analysis results (no database yet)
- Frontend connects to the real backend and shows results
- **Response is HARDCODED** – real analysis begins in Part 4

## How to Run

### Terminal 1 – Start Backend
```bash
cd resu-score-backend
npm install
npm run dev
```
Backend runs at: http://localhost:3001

### Terminal 2 – Start Frontend
```bash
cd resu-score-frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

## What to Show the Faculty
1. Show the backend terminal starting with `🚀 Server running on port 3001`
2. Visit `http://localhost:3001/api/health` → shows `{"status":"OK",...}`
3. Upload any PDF/DOCX in the frontend → backend logs `📄 File received`
4. Results page shows score = **72** (hardcoded)
5. Upload again → History tab shows the entry (in-memory)

## Key Code to Show
- `src/routes/upload.ts` – hardcoded response at the bottom
- `src/store.ts` – in-memory array storing analyses
- `src/index.ts` – Express app setup

## Notes
- No MongoDB needed for this part
- History resets when backend server restarts (in-memory)
- `.env` is pre-filled — no configuration needed
