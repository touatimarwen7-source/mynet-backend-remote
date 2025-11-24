const schedule = require('node-schedule');
const db = require('../config/db');
const OpeningReportService = require('../services/OpeningReportService');

class TenderAutoCloseJob {
  static async runAutoCloseJob() {
    console.log('🕐 [TenderAutoCloseJob] Running tender auto-close check...');
    try {
      const result = await db.query(
        `SELECT id, tender_number, title, deadline, buyer_id 
         FROM tenders 
         WHERE status = 'published' 
         AND deadline < NOW() 
         AND is_deleted = FALSE 
         LIMIT 100`
      );

      if (result.rows.length === 0) {
        console.log('✅ No tenders to close');
        return;
      }

      console.log(`📋 Found ${result.rows.length} tenders to close`);

      for (const tender of result.rows) {
        try {
          const offersResult = await db.query(
            `SELECT * FROM offers 
             WHERE tender_id = $1 
             AND status IN ('submitted', 'received')
             AND is_deleted = FALSE`,
            [tender.id]
          );

          const offers = offersResult.rows;

          await OpeningReportService.createOpeningReport(
            tender.id,
            offers,
            tender.buyer_id
          );

          await db.query(
            `UPDATE tenders 
             SET status = 'closed', updated_at = NOW() 
             WHERE id = $1`,
            [tender.id]
          );

          console.log(`✅ Closed tender #${tender.tender_number} with ${offers.length} offers`);
        } catch (error) {
          console.error(`❌ Error closing tender ${tender.id}:`, error.message);
        }
      }
      console.log('✅ [TenderAutoCloseJob] Completed');
    } catch (error) {
      console.error('❌ [TenderAutoCloseJob] Error:', error.message);
    }
  }

  static scheduleJob() {
    console.log('🔄 [TenderAutoCloseJob] Scheduling job to run every minute...');
    const job = schedule.scheduleJob('* * * * *', async () => {
      await this.runAutoCloseJob();
    });
    console.log('✅ [TenderAutoCloseJob] Job scheduled successfully');
    return job;
  }
}

module.exports = TenderAutoCloseJob;
