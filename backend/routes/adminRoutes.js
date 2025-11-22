const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// جميع مسارات الإدارة محمية - admin فقط
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.checkRole(['admin']));

// ===== لوحة التحكم =====
router.get('/health', adminController.getHealthDashboard);
router.get('/dashboard', adminController.getDashboard);
router.get('/audit-logs/export', adminController.exportAuditLogs);

// ===== إدارة المستخدمين =====
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/role', adminController.updateUserRole);
router.post('/users/:id/block', adminController.blockUser);
router.post('/users/:id/unblock', adminController.unblockUser);
router.post('/users/:id/reset-password', adminController.resetUserPassword);

// ===== إدارة المحتوى الثابت =====
router.get('/content/pages', adminController.getAllPages);
router.get('/content/pages/:id', adminController.getPageById);
router.put('/content/pages/:id', adminController.updatePage);
router.post('/content/pages', adminController.createPage);
router.delete('/content/pages/:id', adminController.deletePage);

router.get('/content/files', adminController.getAllFiles);
router.post('/content/files', adminController.uploadFile);
router.delete('/content/files/:id', adminController.deleteFile);

// ===== إعدادات النظام =====
router.get('/system/config', adminController.getSystemConfig);
router.put('/system/config', adminController.updateSystemConfig);
router.post('/system/maintenance', adminController.toggleMaintenance);

module.exports = router;
