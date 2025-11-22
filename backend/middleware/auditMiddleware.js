const auditLogsRoutes = require('../routes/auditLogsRoutes');

const auditMiddleware = (action, entityType) => {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const db = req.app.get('db');
        const entityId = req.params.id || req.params.userId || req.body?.id;
        
        auditLogsRoutes.logAction(
          db,
          req.user.id,
          action,
          entityType,
          entityId,
          {
            method: req.method,
            path: req.path,
            ip: req.ip,
          }
        );
      }

      return originalSend.call(this, data);
    };

    next();
  };
};

module.exports = auditMiddleware;
