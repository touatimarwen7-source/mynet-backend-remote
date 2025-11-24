/**
 * Opening Report Service
 * Handles creation and retrieval of tender opening reports (procès-verbal)
 */

const db = require('../config/db');

class OpeningReportService {
  /**
   * Create opening report when tender closes
   */
  static async createOpeningReport(tenderId, offers, userId) {
    try {
      const offersData = offers.map(offer => ({
        id: offer.id,
        supplier_name: offer.supplier_name || 'Unknown',
        supplier_id: offer.supplier_id,
        total_amount: offer.total_amount,
        submitted_at: offer.submitted_at,
        status: offer.status,
        is_valid: true
      }));

      const report = await db.query(
        `INSERT INTO opening_reports (
          tender_id, 
          opened_by, 
          total_offers_received,
          total_valid_offers,
          offers_data,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          tenderId,
          userId,
          offersData.length,
          offersData.length,
          JSON.stringify(offersData),
          'open'
        ]
      );

      return report.rows[0];
    } catch (error) {
      console.error('Error creating opening report:', error);
      throw error;
    }
  }

  /**
   * Get opening report by tender ID
   */
  static async getOpeningReportByTenderId(tenderId) {
    try {
      const result = await db.query(
        `SELECT * FROM opening_reports 
         WHERE tender_id = $1 
         ORDER BY opened_at DESC 
         LIMIT 1`,
        [tenderId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const report = result.rows[0];
      report.offers_data = typeof report.offers_data === 'string' 
        ? JSON.parse(report.offers_data) 
        : report.offers_data;

      return report;
    } catch (error) {
      console.error('Error fetching opening report:', error);
      throw error;
    }
  }

  /**
   * Get all opening reports for a buyer
   */
  static async getOpeningReportsByBuyer(buyerId) {
    try {
      const result = await db.query(
        `SELECT or.*, t.title, t.tender_number, u.username 
         FROM opening_reports or
         JOIN tenders t ON or.tender_id = t.id
         JOIN users u ON or.opened_by = u.id
         WHERE t.buyer_id = $1
         ORDER BY or.opened_at DESC`,
        [buyerId]
      );

      return result.rows.map(report => ({
        ...report,
        offers_data: typeof report.offers_data === 'string' 
          ? JSON.parse(report.offers_data) 
          : report.offers_data
      }));
    } catch (error) {
      console.error('Error fetching opening reports:', error);
      throw error;
    }
  }

  /**
   * Export opening report (PDF/JSON)
   */
  static async exportOpeningReport(reportId, format = 'json') {
    try {
      const result = await db.query(
        `SELECT or.*, t.title, t.tender_number, t.deadline, t.budget_max,
                u.username as opened_by_name, u.email as opened_by_email
         FROM opening_reports or
         JOIN tenders t ON or.tender_id = t.id
         JOIN users u ON or.opened_by = u.id
         WHERE or.id = $1`,
        [reportId]
      );

      if (result.rows.length === 0) {
        throw new Error('Opening report not found');
      }

      const report = result.rows[0];
      report.offers_data = typeof report.offers_data === 'string' 
        ? JSON.parse(report.offers_data) 
        : report.offers_data;

      return {
        success: true,
        format,
        report
      };
    } catch (error) {
      console.error('Error exporting opening report:', error);
      throw error;
    }
  }
}

module.exports = OpeningReportService;
