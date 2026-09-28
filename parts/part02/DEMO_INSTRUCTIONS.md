# 📌 Part 2 of 10 – File Upload UI (Frontend Only)

## What This Part Demonstrates
- Drag-and-drop upload zone (react-dropzone)
- PDF and DOCX file type validation (client-side)
- File size validation (max 5MB)
- Job description optional text area
- Upload progress simulation (animated loading bar)
- Loading screen with animated steps
- Results page renders with mock data
- Toast notifications for errors

## How to Run

### Step 1 – Install dependencies
```bash
cd resu-score-frontend
npm install
```

### Step 2 – Start the dev server
```bash
npm run dev
```

### Step 3 – Open in browser
Visit: http://localhost:5173

## What to Show the Faculty
1. Drag a PDF/DOCX onto the upload zone → it highlights and accepts the file
2. Try uploading a .txt or .jpg → shows error toast "Only PDF and DOCX files are allowed"
3. Click "Analyze Resume" → sees the animated loading screen
4. After ~3 seconds → navigates to Results page with **mock data** (score = 72)
5. Optionally type a job description in the text area before uploading

## Notes
- ❌ No backend is needed — this is a **frontend-only** demo
- The API call is intercepted by a mock that simulates progress and returns dummy scores
- node_modules is excluded — run `npm install` before the demo
