const express = require('express');
const router = express.Router();
const OpeningReportService = require('../services/OpeningReportService');

// GET opening report for a tender
router.get('/tenders/:tenderId/opening-report', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const report = await OpeningReportService.getOpeningReportByTenderId(tenderId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Opening report not found' });
    }
    res.status(200).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all opening reports for logged-in buyer
router.get('/my-opening-reports', async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const reports = await OpeningReportService.getOpeningReportsByBuyer(req.user.userId);
    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export opening report
router.get('/:reportId/export', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { format = 'json' } = req.query;
    const result = await OpeningReportService.exportOpeningReport(reportId, format);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="opening-report-${reportId}.${format}"`);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
