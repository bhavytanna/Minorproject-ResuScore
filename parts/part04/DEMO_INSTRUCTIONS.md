# 📌 Part 4 of 10 – Resume Text Extraction

## What This Part Demonstrates
- **pdf-parse** library: extracts real text from PDF files
- **mammoth** library: extracts real text from DOCX files
- `fileProcessor.ts` service: cleanText, normalizeWhitespace, countWords, isResumeLike
- Returns REAL values: `wordCount`, `characterCount`, `textPreview`, `metadata.pageCount`
- File is deleted after processing (no permanent storage)
- Scores are still hardcoded (real analysis modules added in Parts 5–8)

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
1. Upload a PDF resume → backend logs `✅ Extracted XXX words`
2. Results page shows:
   - **Real word count** (not 500 like in Part 3)
   - **Real text preview** (first 200 chars of actual resume text)
   - **Real page count** (from PDF metadata)
3. Upload a DOCX → same real extraction works
4. Show `src/services/fileProcessor.ts` – the extraction code

## Key Code to Show
- `src/services/fileProcessor.ts` – extractTextFromPDF, extractTextFromDOCX
- `src/routes/upload.ts` – processResumeFile() call, real wordCount in response

## Notes
- No MongoDB needed for this part
- Scores (72, 75, 70, 68) are still hardcoded in the response
- `.env` is pre-filled — no configuration needed
