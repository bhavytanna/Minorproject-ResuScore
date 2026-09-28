import express from 'express';
import { analyses } from '../store';

const router = express.Router();

// Get analysis by ID (reads from in-memory store)
router.get('/:id', (req, res) => {
  const clientId = req.header('X-Client-Id');
  if (!clientId) {
    return res.status(400).json({ error: 'Missing client identifier' });
  }

  const analysis = analyses.find(
    (a) => a._id === req.params.id && a.clientId === clientId
  );

  if (!analysis) {
    return res.status(404).json({ error: 'Analysis not found' });
  }

  // Return stored full response if available
  if (analysis.fullResponse) {
    return res.json(analysis.fullResponse);
  }

  res.json(analysis.analysisResults);
});

// Get all analyses for this browser (reads from in-memory store)
router.get('/', (req, res) => {
  const clientId = req.header('X-Client-Id');
  if (!clientId) {
    return res.status(400).json({ error: 'Missing client identifier' });
  }

  const clientAnalyses = analyses
    .filter((a) => a.clientId === clientId)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 50);

  res.json(clientAnalyses);
});

export default router;
