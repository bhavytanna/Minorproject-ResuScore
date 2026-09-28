import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { analyses, generateId } from '../store';

const router = express.Router();

// ============================================================
// PART 3: Upload route returns a HARDCODED dummy response.
// The file is accepted and immediately deleted.
// No text extraction or analysis is performed yet.
// ============================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', upload.single('resume'), async (req, res) => {
  let filePath: string | null = null;

  try {
    const clientId = req.header('X-Client-Id');
    if (!clientId) return res.status(400).json({ error: 'Missing client identifier' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const fileType = fileExt === '.pdf' ? 'pdf' : 'docx';

    console.log(`📄 File received: ${req.file.originalname} (${req.file.size} bytes)`);
    console.log(`⚠️  Part 3: Returning HARDCODED dummy analysis response`);

    // Delete file — no processing in this part
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const analysisId = generateId();

    // HARDCODED dummy response
    const response = {
      message: 'File uploaded and processed successfully',
      analysisId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType,
      size: req.file.size,
      wordCount: 500,         // HARDCODED – real extraction added in Part 4
      characterCount: 3200,   // HARDCODED
      isResumeLike: true,
      textPreview: '[Text extraction not yet implemented – coming in Part 4]',
      metadata: { pageCount: 1 },
      formatAnalysis: {
        formatScore: 75,      // HARDCODED – real analysis added in Part 5
        isSingleColumn: true,
        hasImages: false,
        hasTables: false,
        suggestions: ['Format analysis coming in Part 5'],
      },
      contentAnalysis: {
        contentScore: 70,     // HARDCODED – real analysis added in Part 6
        hasContact: true,
        hasExperience: true,
        hasEducation: true,
        hasSkills: true,
        skillCount: 10,
        experienceCount: 3,
        educationCount: 1,
        suggestions: ['Content analysis coming in Part 6'],
      },
      atsAnalysis: {
        atsScore: 68,         // HARDCODED – real analysis added in Part 7
        keywordCount: 20,
        keywordDensity: 4.0,
        bulletCount: 12,
        hasActionVerbs: true,
        hasQuantifiedResults: false,
        estimatedPages: 1,
        suggestions: ['ATS analysis coming in Part 7'],
      },
      checklistValidation: {
        overallCompliance: 70,
        missingItems: ['Checklist validation coming in Part 8'],
        fileFormat: true,
        structure: true,
        headings: true,
        skills: true,
        experience: true,
        contact: true,
        dates: true,
      },
      grammarCheck: {
        score: 90,
        issueCount: 0,
        errorCount: 0,
        warningCount: 0,
        suggestionCount: 0,
        issues: [],
      },
      keywordSuggestions: { missingKeywords: [] },
      overallScore: 72,       // HARDCODED
    };

    // Save to in-memory store
    analyses.push({
      _id: analysisId,
      clientId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType,
      fileSize: req.file.size,
      uploadDate: new Date(),
      analysisResults: {
        overallScore: response.overallScore,
        formatScore: response.formatAnalysis.formatScore,
        contentScore: response.contentAnalysis.contentScore,
        atsScore: response.atsAnalysis.atsScore,
        checks: {
          fileFormat: true,
          structure: true,
          headings: true,
          skills: true,
          experience: true,
          education: true,
          contactInfo: true,
          keywords: true,
          dates: true,
          length: true,
        },
        suggestions: ['Hardcoded suggestions – real ones coming in Parts 5–8'],
        extractedText: '',
        sections: {},
      },
      fullResponse: response,
    });

    res.json(response);
  } catch (error: any) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

export default router;
