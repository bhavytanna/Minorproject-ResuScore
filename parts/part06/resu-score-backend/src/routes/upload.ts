import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processResumeFile, deleteFile } from '../services/fileProcessor';
import { analyzeFormat } from '../services/formatAnalyzer';
import { analyzeContent } from '../services/contentAnalyzer';
import { analyses, generateId } from '../store';

const router = express.Router();

// ============================================================
// PART 6: Content Analysis Module added.
// Now runs contentAnalyzer on extracted text.
// Returns REAL content score, detected sections (skills,
// experience, education, contact), skill count, entry counts.
// ATS and Checklist scores still HARDCODED.
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

    // ✅ REAL: Format analysis
    console.log('🔍 Running format analysis...');
    const formatAnalysis = analyzeFormat(processedFile.cleanedText, processedFile.wordCount);

    // ✅ REAL: Content analysis
    console.log('🔍 Running content analysis...');
    const contentAnalysis = analyzeContent(processedFile.cleanedText);
    console.log(`✅ Content score: ${contentAnalysis.overallContentScore}`);

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
        formatScore: formatAnalysis.overallFormatScore,
        isSingleColumn: formatAnalysis.layout.isSingleColumn,
        hasImages: formatAnalysis.images.hasImages,
        hasTables: formatAnalysis.tables.hasTables,
        suggestions: formatAnalysis.suggestions.slice(0, 3),
      },
      contentAnalysis: {
        // ✅ REAL content analysis results:
        contentScore: contentAnalysis.overallContentScore,
        hasContact: contentAnalysis.contact.hasEmail && contentAnalysis.contact.hasPhone,
        hasExperience: contentAnalysis.experience.hasExperienceSection,
        hasEducation: contentAnalysis.education.hasEducationSection,
        hasSkills: contentAnalysis.skills.hasSkillsSection,
        skillCount: contentAnalysis.skills.skillCount,
        experienceCount: contentAnalysis.experience.entryCount,
        educationCount: contentAnalysis.education.entryCount,
        suggestions: contentAnalysis.suggestions.slice(0, 3),
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
        skills: contentAnalysis.skills.hasSkillsSection,
        experience: contentAnalysis.experience.hasExperienceSection,
        contact: contentAnalysis.contact.hasEmail,
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
      overallScore: Math.round(
        formatAnalysis.overallFormatScore * 0.20 +
        contentAnalysis.overallContentScore * 0.25 +
        68 * 0.55   // placeholder for ATS + checklist
      ),
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
        contentScore: contentAnalysis.overallContentScore,
        atsScore: 68,
        checks: {
          fileFormat: true,
          structure: formatAnalysis.layout.isSingleColumn,
          headings: true,
          skills: contentAnalysis.skills.hasSkillsSection,
          experience: contentAnalysis.experience.hasExperienceSection,
          education: contentAnalysis.education.hasEducationSection,
          contactInfo: contentAnalysis.contact.hasEmail && contentAnalysis.contact.hasPhone,
          keywords: true,
          dates: true,
          length: true,
        },
        suggestions: [...formatAnalysis.suggestions, ...contentAnalysis.suggestions],
        extractedText: processedFile.cleanedText,
        sections: {
          contact: { emails: contentAnalysis.contact.emails, phones: contentAnalysis.contact.phones },
          skills: contentAnalysis.skills.skillsFound,
          experience: contentAnalysis.experience.entries,
          education: contentAnalysis.education.entries,
        },
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
