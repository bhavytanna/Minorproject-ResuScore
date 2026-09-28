# 📌 Part 5 of 10 – Format Analysis Module

## What This Part Demonstrates
- `formatAnalyzer.ts` service running on extracted resume text
- Detects: single-column vs multi-column layout
- Detects: presence of images and tables (ATS-unfriendly)
- Checks: line length consistency, section spacing
- Returns REAL `formatScore` (0–100)
- Returns top 3 real format improvement suggestions
- Content, ATS, and Checklist scores still hardcoded

## How to Run

### Terminal 1 – Start Backend
```bash
cd resu-score-backend
npm install
npm run dev
```

### Terminal 2 – Start Frontend
```bash
cd resu-score-frontend
npm install
npm run dev
```

## What to Show the Faculty
1. Upload a PDF resume → backend logs `✅ Format score: XX`
2. Results page shows:
   - **Real Format Score card** (not hardcoded 75)
   - **Real format suggestions** specific to the uploaded resume
   - Single-column layout detection result
3. Upload a different resume → format score changes based on content
4. Show `src/services/formatAnalyzer.ts`

## Key Code to Show
- `src/services/formatAnalyzer.ts` – the full analysis logic
- `src/routes/upload.ts` – `analyzeFormat()` call and response building

## Notes
- Overall score partially based on real format score + 80% filler placeholder
- No MongoDB needed for this part
