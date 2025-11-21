import { useState, useEffect } from 'react';
import '../styles/alert-strip.css';

export default function AlertStrip() {
  const [alerts, setAlerts] = useState([]);
  const [visibleAlerts, setVisibleAlerts] = useState(new Set());

  useEffect(() => {
    // Simulate checking for critical alerts
    const criticalAlerts = [
      {
        id: 1,
        type: 'warning',
        title: '⚠️ Renouvellement de Validité',
        message: 'Votre certification expire dans 15 jours. Veuillez renouveler.'
      },
      {
        id: 2,
        type: 'info',
        title: 'ℹ️ Mise à Jour Importante',
        message: 'Une nouvelle version de la plateforme est disponible.'
      }
    ];

    // Set all alerts as visible initially
    setAlerts(criticalAlerts);
    setVisibleAlerts(new Set(criticalAlerts.map(a => a.id)));
  }, []);

  const closeAlert = (id) => {
    const newVisibleAlerts = new Set(visibleAlerts);
    newVisibleAlerts.delete(id);
    setVisibleAlerts(newVisibleAlerts);
  };

  const closeAllAlerts = () => {
    setVisibleAlerts(new Set());
  };

  // Don't render if no visible alerts
  if (visibleAlerts.size === 0) return null;

  return (
    <div className="alert-strip-container">
      {alerts.map(
        (alert) =>
          visibleAlerts.has(alert.id) && (
            <div key={alert.id} className={`alert-strip alert-${alert.type}`}>
              <div className="alert-content">
                <span className="alert-title">{alert.title}</span>
                <span className="alert-message">{alert.message}</span>
              </div>
              <button
                className="alert-close"
                onClick={() => closeAlert(alert.id)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
          )
      )}
      {visibleAlerts.size > 1 && (
        <button className="close-all-alerts" onClick={closeAllAlerts}>
          Fermer tout
        </button>
      )}
    </div>
  );
}
