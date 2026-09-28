import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processResumeFile, deleteFile } from '../services/fileProcessor';
import { analyses, generateId } from '../store';

const router = express.Router();

// ============================================================
// PART 4: Real text extraction from PDF/DOCX.
// Uses pdf-parse (PDF) and mammoth (DOCX) to extract real text.
// Returns actual word count, character count, text preview.
// Scores are still HARDCODED – real analysis starts in Part 5.
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
    if (allowedTypes.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF and DOCX files are allowed!'));
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

    console.log(`📄 Processing ${fileType.toUpperCase()}: ${req.file.originalname}`);

    // ✅ REAL: Extract text from PDF or DOCX
    const processedFile = await processResumeFile(filePath, fileType);

    if (!processedFile.success) {
      deleteFile(filePath);
      return res.status(400).json({ error: 'Failed to extract text', details: processedFile.error });
    }

    console.log(`✅ Extracted ${processedFile.wordCount} words from the resume`);

    // Delete file after processing
    deleteFile(filePath);

    const analysisId = generateId();

    const response = {
      message: 'File uploaded and processed successfully',
      analysisId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType,
      size: req.file.size,
      // ✅ REAL values from actual text extraction:
      wordCount: processedFile.wordCount,
      characterCount: processedFile.characterCount,
      isResumeLike: processedFile.isResumeLike,
      textPreview: processedFile.cleanedText.substring(0, 200) + '...',
      metadata: processedFile.metadata,
      formatAnalysis: {
        formatScore: 75,    // HARDCODED – real format analysis in Part 5
        isSingleColumn: true,
        hasImages: false,
        hasTables: false,
        suggestions: ['Format analysis coming in Part 5'],
      },
      contentAnalysis: {
        contentScore: 70,   // HARDCODED – real content analysis in Part 6
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
        atsScore: 68,       // HARDCODED – real ATS analysis in Part 7
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
      overallScore: 72,     // HARDCODED
    };

    analyses.push({
      _id: analysisId,
      clientId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType,
      fileSize: req.file.size,
      uploadDate: new Date(),
      analysisResults: {
        overallScore: 72,
        formatScore: 75,
        contentScore: 70,
        atsScore: 68,
        checks: { fileFormat: true, structure: true, headings: true, skills: true, experience: true, education: true, contactInfo: true, keywords: true, dates: true, length: true },
        suggestions: [],
        extractedText: processedFile.cleanedText,
        sections: {},
      },
      fullResponse: response,
    });

    res.json(response);
  } catch (error: any) {
    if (filePath) deleteFile(filePath);
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

export default router;
