// ============================================================
// In-Memory Store – used by Parts 03–09 (no MongoDB needed)
// Data is stored in RAM and resets when the server restarts.
// ============================================================

export interface StoredAnalysis {
  _id: string;
  clientId: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  analysisResults: any;
  fullResponse?: any;
}

export const analyses: StoredAnalysis[] = [];

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
