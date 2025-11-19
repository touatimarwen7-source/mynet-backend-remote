
const { getPool } = require('../config/db');
const AuditLogService = require('./AuditLogService');

class SupplierVerificationService {
    /**
     * Submit verification request
     */
    async submitVerificationRequest(userId, verificationData) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `INSERT INTO supplier_verifications 
                 (user_id, company_registration, tax_id, verification_document, verification_status)
                 VALUES ($1, $2, $3, $4, 'pending')
                 ON CONFLICT (user_id) 
                 DO UPDATE SET 
                    company_registration = $2,
                    tax_id = $3,
                    verification_document = $4,
                    verification_status = 'pending',
                    updated_at = CURRENT_TIMESTAMP
                 RETURNING *`,
                [
                    userId,
                    verificationData.company_registration,
                    verificationData.tax_id || null,
                    JSON.stringify(verificationData.documents || {})
                ]
            );

            await AuditLogService.log(
                userId,
                'supplier_verification',
                result.rows[0].id,
                'submit',
                'Supplier verification request submitted'
            );

            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to submit verification request: ${error.message}`);
        }
    }

    /**
     * Verify supplier (Admin only)
     */
    async verifySupplier(verificationId, adminId, approved, notes = '') {
        const pool = getPool();

        try {
            const status = approved ? 'approved' : 'rejected';

            const result = await pool.query(
                `UPDATE supplier_verifications 
                 SET verification_status = $1, 
                     verified_at = CURRENT_TIMESTAMP,
                     verified_by = $2,
                     notes = $3,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $4
                 RETURNING *`,
                [status, adminId, notes, verificationId]
            );

            if (result.rows.length === 0) {
                throw new Error('Verification request not found');
            }

            // Update user verification status
            if (approved) {
                await pool.query(
                    'UPDATE users SET is_verified = TRUE WHERE id = $1',
                    [result.rows[0].user_id]
                );
            }

            await AuditLogService.log(
                adminId,
                'supplier_verification',
                verificationId,
                status,
                `Supplier verification ${status} by admin`
            );

            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to verify supplier: ${error.message}`);
        }
    }

    /**
     * Get verification status
     */
    async getVerificationStatus(userId) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `SELECT sv.*, u.username, u.company_name,
                 admin.full_name as verified_by_name
                 FROM supplier_verifications sv
                 JOIN users u ON sv.user_id = u.id
                 LEFT JOIN users admin ON sv.verified_by = admin.id
                 WHERE sv.user_id = $1`,
                [userId]
            );

            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Failed to get verification status: ${error.message}`);
        }
    }

    /**
     * Get pending verifications (Admin only)
     */
    async getPendingVerifications() {
        const pool = getPool();

        try {
            const result = await pool.query(
                `SELECT sv.*, u.username, u.email, u.company_name, u.phone
                 FROM supplier_verifications sv
                 JOIN users u ON sv.user_id = u.id
                 WHERE sv.verification_status = 'pending'
                 ORDER BY sv.created_at ASC`
            );

            return result.rows;
        } catch (error) {
            throw new Error(`Failed to get pending verifications: ${error.message}`);
        }
    }
}

module.exports = new SupplierVerificationService();
