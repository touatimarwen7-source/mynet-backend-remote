/**
 * WebSocket Events Manager
 * Handles all real-time event broadcasting and user notifications
 */

class WebSocketEventsManager {
  constructor(io) {
    this.io = io;
    this.userConnections = new Map(); // Track user connections
  }

  /**
   * Register user connection
   */
  registerUserConnection(userId, socketId) {
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, []);
    }
    this.userConnections.get(userId).push(socketId);
  }

  /**
   * Remove user connection
   */
  removeUserConnection(userId, socketId) {
    if (this.userConnections.has(userId)) {
      const connections = this.userConnections.get(userId);
      const index = connections.indexOf(socketId);
      if (index > -1) {
        connections.splice(index, 1);
      }
      if (connections.length === 0) {
        this.userConnections.delete(userId);
      }
    }
  }

  /**
   * 📦 Emit: New Offer Created
   */
  emitOfferCreated(tenderId, offerData) {
    this.io.to(`tender-${tenderId}`).emit('offer-created', {
      type: 'offer-created',
      tenderId,
      offerId: offerData.id,
      supplierName: offerData.supplier_name,
      price: offerData.price,
      currency: offerData.currency,
      timestamp: new Date()
    });
  }

  /**
   * 🎯 Emit: Tender Status Changed
   */
  emitTenderStatusChanged(tenderId, status, changedBy) {
    this.io.to(`tender-${tenderId}`).emit('tender-status-changed', {
      type: 'tender-status-changed',
      tenderId,
      status,
      changedBy,
      timestamp: new Date()
    });
  }

  /**
   * 💬 Emit: New Message
   */
  emitNewMessage(recipientId, senderData) {
    this.io.to(`user-${recipientId}`).emit('message-received', {
      type: 'message-received',
      senderId: senderData.senderId,
      senderName: senderData.senderName,
      message: senderData.message,
      timestamp: new Date()
    });
  }

  /**
   * ⭐ Emit: Rating Received
   */
  emitRatingReceived(supplierId, ratingData) {
    this.io.to(`user-${supplierId}`).emit('rating-received', {
      type: 'rating-received',
      rating: ratingData.rating,
      reviewer: ratingData.reviewer,
      comment: ratingData.comment,
      timestamp: new Date()
    });
  }

  /**
   * 📧 Emit: Email Notification Sent
   */
  emitEmailNotification(userId, emailData) {
    this.io.to(`user-${userId}`).emit('email-sent', {
      type: 'email-sent',
      subject: emailData.subject,
      recipientEmail: emailData.recipientEmail,
      timestamp: new Date()
    });
  }

  /**
   * 👥 Emit: User Online Status
   */
  emitUserOnline(userId) {
    this.io.emit('user-online', {
      type: 'user-online',
      userId,
      timestamp: new Date()
    });
  }

  /**
   * 👥 Emit: User Offline Status
   */
  emitUserOffline(userId) {
    this.io.emit('user-offline', {
      type: 'user-offline',
      userId,
      timestamp: new Date()
    });
  }

  /**
   * 🔔 Emit: Generic Notification
   */
  emitNotification(userId, notification) {
    this.io.to(`user-${userId}`).emit('notification', {
      type: 'notification',
      title: notification.title,
      message: notification.message,
      icon: notification.icon,
      action: notification.action,
      timestamp: new Date()
    });
  }

  /**
   * 🎯 Emit: Tender Update to All Watchers
   */
  emitTenderUpdated(tenderId, updateData) {
    this.io.to(`tender-${tenderId}`).emit('tender-updated', {
      type: 'tender-updated',
      tenderId,
      field: updateData.field,
      newValue: updateData.newValue,
      oldValue: updateData.oldValue,
      changedBy: updateData.changedBy,
      timestamp: new Date()
    });
  }

  /**
   * 📊 Emit: Statistics Update
   */
  emitStatisticsUpdate(userId, stats) {
    this.io.to(`user-${userId}`).emit('statistics-updated', {
      type: 'statistics-updated',
      stats,
      timestamp: new Date()
    });
  }

  /**
   * 🚨 Emit: Critical Alert
   */
  emitCriticalAlert(userId, alert) {
    this.io.to(`user-${userId}`).emit('critical-alert', {
      type: 'critical-alert',
      level: alert.level || 'warning',
      title: alert.title,
      message: alert.message,
      action: alert.action,
      timestamp: new Date()
    });
  }

  /**
   * Get user connection count
   */
  getUserConnectionCount(userId) {
    return this.userConnections.get(userId)?.length || 0;
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId) {
    return this.userConnections.has(userId);
  }

  /**
   * Get all online users count
   */
  getOnlineUsersCount() {
    return this.userConnections.size;
  }
}

module.exports = WebSocketEventsManager;
