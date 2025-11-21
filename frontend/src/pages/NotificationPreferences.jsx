import { useState, useEffect } from 'react';
import axios from 'axios';
import { setPageTitle } from '../utils/pageTitle';

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    tender_updates: true,
    bid_updates: true,
    payment_notifications: true,
    system_alerts: true,
    marketing: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Préférences de Notifications');
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/notification-preferences', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setPreferences(response.data.preferences || preferences);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:3000/api/user/notification-preferences', preferences, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      alert('Préférences sauvegardées');
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;

  return (
    <div className="notification-preferences">
      <h1>🔔 Préférences de Notifications</h1>

      <div className="preferences-section">
        <h2>Mises à Jour des Appels d'Offres</h2>
        <label>
          <input
            type="checkbox"
            checked={preferences.tender_updates}
            onChange={(e) => setPreferences({...preferences, tender_updates: e.target.checked})}
          />
          Me notifier des nouvelles publications d'AO
        </label>
        <label>
          <input
            type="checkbox"
            checked={preferences.bid_updates}
            onChange={(e) => setPreferences({...preferences, bid_updates: e.target.checked})}
          />
          Me notifier des mises à jour d'offres
        </label>
      </div>

      <div className="preferences-section">
        <h2>Notifications Financières</h2>
        <label>
          <input
            type="checkbox"
            checked={preferences.payment_notifications}
            onChange={(e) => setPreferences({...preferences, payment_notifications: e.target.checked})}
          />
          Me notifier des paiements reçus
        </label>
      </div>

      <div className="preferences-section">
        <h2>Alertes Système</h2>
        <label>
          <input
            type="checkbox"
            checked={preferences.system_alerts}
            onChange={(e) => setPreferences({...preferences, system_alerts: e.target.checked})}
          />
          Me notifier des alertes système critiques
        </label>
      </div>

      <div className="preferences-section">
        <h2>Marketing</h2>
        <label>
          <input
            type="checkbox"
            checked={preferences.marketing}
            onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
          />
          Me notifier des offres spéciales et promotions
        </label>
      </div>

      <button className="btn btn-primary" onClick={handleSave}>💾 Sauvegarder les Préférences</button>
    </div>
  );
}
