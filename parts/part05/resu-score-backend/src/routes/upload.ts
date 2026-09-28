import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processResumeFile, deleteFile } from '../services/fileProcessor';
import { analyzeFormat } from '../services/formatAnalyzer';
import { analyses, generateId } from '../store';

const router = express.Router();

// ============================================================
// PART 5: Format Analysis Module added.
// Now runs formatAnalyzer on the extracted text.
// Returns REAL format score, layout detection, format suggestions.
// Content, ATS, Checklist scores still HARDCODED.
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

    // ✅ REAL: Extract text
    console.log(`📄 Processing ${fileType.toUpperCase()}: ${req.file.originalname}`);
    const processedFile = await processResumeFile(filePath, fileType);
    if (!processedFile.success) {
      deleteFile(filePath);
      return res.status(400).json({ error: 'Failed to extract text', details: processedFile.error });
    }

    // ✅ REAL: Run format analysis
    console.log('🔍 Running format analysis...');
    const formatAnalysis = analyzeFormat(processedFile.cleanedText, processedFile.wordCount);
    console.log(`✅ Format score: ${formatAnalysis.overallFormatScore}`);

    deleteFile(filePath);

    const analysisId = generateId();

    const response = {
      message: 'File uploaded and processed successfully',
      analysisId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType,
      size: req.file.size,
      wordCount: processedFile.wordCount,
      characterCount: processedFile.characterCount,
      isResumeLike: processedFile.isResumeLike,
      textPreview: processedFile.cleanedText.substring(0, 200) + '...',
      metadata: processedFile.metadata,
      formatAnalysis: {
        // ✅ REAL format analysis results:
        formatScore: formatAnalysis.overallFormatScore,
        isSingleColumn: formatAnalysis.layout.isSingleColumn,
        hasImages: formatAnalysis.images.hasImages,
        hasTables: formatAnalysis.tables.hasTables,
        suggestions: formatAnalysis.suggestions.slice(0, 3),
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
      // Overall = just format for now (will add more weights in later parts)
      overallScore: Math.round(formatAnalysis.overallFormatScore * 0.20 + 70 * 0.80),
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
        overallScore: response.overallScore,
        formatScore: formatAnalysis.overallFormatScore,
        contentScore: 70,
        atsScore: 68,
        checks: { fileFormat: true, structure: formatAnalysis.layout.isSingleColumn, headings: true, skills: true, experience: true, education: true, contactInfo: true, keywords: true, dates: true, length: true },
        suggestions: formatAnalysis.suggestions,
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
