import { useState, useEffect } from 'react';
import '../styles/alert-strip.css';

export default function AlertStrip() {
  const [alerts, setAlerts] = useState([]);
  const [visibleAlerts, setVisibleAlerts] = useState(new Set());

  useEffect(() => {
    // No alerts to display
    setAlerts([]);
    setVisibleAlerts(new Set());
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
