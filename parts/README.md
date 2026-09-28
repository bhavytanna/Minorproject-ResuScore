# ResuScore – 12 Evaluation Parts

This folder contains **12 incremental, standalone versions** of the ResuScore project.
Each part builds on the previous one and can be run independently for faculty evaluation.

---

## Quick Overview

| Part | Folder | Frontend | Backend | Key Feature |
|------|--------|----------|---------|-------------|
| 01 | `part01/` | ✅ | ❌ | Landing page UI, navbar, feature cards, animations |
| 02 | `part02/` | ✅ | ❌ | Drag-and-drop upload zone, file validation, mock results |
| 03 | `part03/` | ✅ | ✅ | Express server, file upload API, hardcoded response |
| 04 | `part04/` | ✅ | ✅ | Real PDF/DOCX text extraction (pdf-parse + mammoth) |
| 05 | `part05/` | ✅ | ✅ | Format analysis: layout, images, tables, format score |
| 06 | `part06/` | ✅ | ✅ | Content analysis: skills, experience, education detection |
| 07 | `part07/` | ✅ | ✅ | ATS analysis: keywords, bullets, action verbs, ATS score |
| 08 | `part08/` | ✅ | ✅ | Checklist + grammar check + final weighted overall score |
| 09 | `part09/` | ✅ | ✅ | Full Results UI + History page (in-memory storage) |
| 10 | `part10/` | ✅ | ✅ | MongoDB integration + persistent history (full E2E) |
| 11 | `part11/` | ✅ | ✅ | Job Description matching + Keyword Suggestions API + UI |
| 12 | `part12/` | ✅ | ✅ | Export HTML Report + Industry Benchmark API + Final Polish |

---

## How to Run Each Part

### Parts 01 and 02 (Frontend only)
```bash
cd partXX/resu-score-frontend
npm install
npm run dev
```
Open: http://localhost:5173

### Parts 03–12 (Frontend + Backend)
Open **two terminal windows**:

**Terminal 1 – Backend:**
```bash
cd partXX/resu-score-backend
npm install
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd partXX/resu-score-frontend
npm install
npm run dev
```
Open: http://localhost:5173

---

## Important Notes

- `node_modules` is **excluded** — run `npm install` before each demo
- Backend `.env` is pre-filled (MongoDB URI + PORT)
- Frontend `.env` is pre-filled (`VITE_API_BASE_URL=http://localhost:3001/api`)
- Parts 03–09 use **in-memory storage** (history resets on server restart)
- Parts 10–12 use **MongoDB** (history is permanent across restarts)
- Read `DEMO_INSTRUCTIONS.md` inside each part folder for detailed steps

---

## Demo Script for Faculty

1. **Start with Part 01** → Show the UI design and animations
2. **Part 02** → Show the upload interaction (drag-and-drop, mock results)
3. **Part 03** → Start the backend server, show API connectivity
4. **Part 04** → Upload a real resume, see real word count in response
5. **Part 05** → See real format score change with different resumes
6. **Part 06** → Upload a resume missing skills → see `hasSkills: false`
7. **Part 07** → Upload with/without job description → see ATS match %
8. **Part 08** → Show terminal with all 4 analyzers running, final score
9. **Part 09** → Upload 2 resumes → History shows both → click to revisit
10. **Part 10** → Restart backend → History still shows from MongoDB 🎉
11. **Part 11** → Paste a job description → see `jobMatchPercentage` change + missing keyword tags
12. **Part 12** → Click "Export Report" → download styled HTML report → show Benchmark API → **COMPLETE PROJECT** 🏆
