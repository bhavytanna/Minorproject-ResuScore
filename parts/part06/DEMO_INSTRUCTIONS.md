# 📌 Part 6 of 10 – Content Analysis Module

## What This Part Demonstrates
- `contentAnalyzer.ts` service running on extracted resume text
- Detects presence of key resume sections: Skills, Experience, Education, Contact
- Extracts: email addresses, phone numbers, LinkedIn URLs
- Counts: number of skills listed, experience entries, education entries
- Returns REAL `contentScore` (0–100)
- Returns real content improvement suggestions
- ATS and Checklist scores still hardcoded

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
1. Upload a resume with a Skills section → `hasSkills: true`, skill count is real
2. Upload a resume missing Contact info → `hasContact: false`
3. Results page shows:
   - **Real Content Score** card
   - Real detected sections (Skills ✓, Experience ✓, Education ✓, Contact ✓/✗)
   - Real skill count and experience entry count
4. Show `src/services/contentAnalyzer.ts` – section detection logic

## Key Code to Show
- `src/services/contentAnalyzer.ts` – analyzeContent() function
- `src/routes/upload.ts` – contentAnalysis results in the response

## Notes
- No MongoDB needed
- Overall score uses Format(20%) + Content(25%) + placeholder 55%
