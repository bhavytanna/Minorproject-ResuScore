import type { AnalysisResponse } from '@/types';
import { getClientId } from '@/utils/clientId';

// ============================================================
// PART 2: Mock API — No real backend call is made.
// The upload is simulated with a delay and returns dummy data.
// ============================================================

export const uploadResume = async (
  file: File,
  onProgress?: (progress: number) => void,
  _jobDescription?: string
): Promise<AnalysisResponse> => {
  // Simulate upload progress
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (onProgress) onProgress(100);
        // Return a dummy analysis response after "upload"
        setTimeout(() => {
          resolve(getMockResponse(file.name));
        }, 800);
      } else {
        if (onProgress) onProgress(Math.min(progress, 99));
      }
    }, 300);
  });
};

function getMockResponse(filename: string): AnalysisResponse {
  return {
    message: 'File uploaded and processed successfully (MOCK)',
    analysisId: 'mock-analysis-001',
    filename: filename,
    originalName: filename,
    fileType: filename.endsWith('.pdf') ? 'pdf' : 'docx',
    size: 102400,
    wordCount: 487,
    characterCount: 3124,
    isResumeLike: true,
    textPreview: 'John Doe | Software Engineer | john.doe@email.com | (555) 123-4567...',
    metadata: { pageCount: 1 },
    formatAnalysis: {
      formatScore: 78,
      isSingleColumn: true,
      hasImages: false,
      hasTables: false,
      suggestions: ['Consider using a single-column layout for better ATS compatibility'],
    },
    contentAnalysis: {
      contentScore: 72,
      hasContact: true,
      hasExperience: true,
      hasEducation: true,
      hasSkills: true,
      skillCount: 12,
      experienceCount: 3,
      educationCount: 1,
      suggestions: ['Add more quantified achievements to your experience section'],
    },
    atsAnalysis: {
      atsScore: 68,
      keywordCount: 23,
      keywordDensity: 4.7,
      bulletCount: 15,
      hasActionVerbs: true,
      hasQuantifiedResults: false,
      estimatedPages: 1,
      suggestions: ['Add more industry-specific keywords to improve ATS matching'],
    },
    checklistValidation: {
      overallCompliance: 75,
      missingItems: ['Professional summary section', 'LinkedIn URL'],
      fileFormat: true,
      structure: true,
      headings: true,
      skills: true,
      experience: true,
      contact: true,
      dates: true,
    },
    grammarCheck: {
      score: 92,
      issueCount: 2,
      errorCount: 0,
      warningCount: 2,
      suggestionCount: 0,
      issues: [],
    },
    keywordSuggestions: {
      missingKeywords: ['React', 'Node.js', 'TypeScript'],
    },
    overallScore: 72,
  } as any;
}

export const getAnalysis = async (_analysisId: string): Promise<AnalysisResponse> => {
  return getMockResponse('sample-resume.pdf');
};

export interface AnalysisListItem {
  _id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  analysisResults: {
    overallScore: number;
    formatScore: number;
    contentScore: number;
    atsScore: number;
    checks: { [key: string]: any };
    suggestions: string[];
    extractedText: string;
    sections: { [key: string]: any };
  };
}

export const getAllAnalyses = async (): Promise<AnalysisListItem[]> => {
  return [];
};

export const getBenchmark = async (_analysisId: string) => {
  return {};
};

export interface KeywordSuggestion {
  keyword: string;
  category: 'technical' | 'soft-skill' | 'industry' | 'action-verb' | 'certification' | 'tool';
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface KeywordSuggestionsResponse {
  suggestions: KeywordSuggestion[];
  missingKeywords: string[];
  relatedKeywords: string[];
  industryKeywords: string[];
  actionVerbSuggestions: string[];
}

export const getKeywordSuggestions = async (): Promise<KeywordSuggestionsResponse> => {
  return {
    suggestions: [],
    missingKeywords: [],
    relatedKeywords: [],
    industryKeywords: [],
    actionVerbSuggestions: [],
  };
};
