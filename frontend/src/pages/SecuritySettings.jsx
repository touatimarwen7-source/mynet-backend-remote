import { useState, useEffect } from 'react';
import axios from 'axios';
import { setPageTitle } from '../utils/pageTitle';

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Paramètres de Sécurité');
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/security', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setMfaEnabled(response.data.mfa_enabled || false);
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/user/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      alert('Mot de passe changé avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  const handleToggleMFA = async () => {
    try {
      await axios.post('http://localhost:3000/api/user/toggle-mfa', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setMfaEnabled(!mfaEnabled);
      alert(mfaEnabled ? 'MFA désactivé' : 'MFA activé');
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (!confirm('Êtes-vous sûr?')) return;
    try {
      await axios.post(`http://localhost:3000/api/user/revoke-session/${sessionId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      fetchSecurityData();
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;

  return (
    <div className="security-settings">
      <h1>🔒 Paramètres de Sécurité</h1>

      {/* Changement de Mot de Passe */}
      <div className="settings-section">
        <h2>🔑 Mot de Passe</h2>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label>Mot de passe actuel:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Nouveau mot de passe:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">✓ Changer le Mot de Passe</button>
        </form>
      </div>

      {/* Authentification Multi-Facteurs */}
      <div className="settings-section">
        <h2>🔐 Authentification Deux Facteurs (2FA)</h2>
        <p>
          {mfaEnabled ? (
            <span className="badge badge-success">✓ Activé</span>
          ) : (
            <span className="badge badge-warning">✗ Désactivé</span>
          )}
        </p>
        <button className={`btn ${mfaEnabled ? 'btn-danger' : 'btn-success'}`} onClick={handleToggleMFA}>
          {mfaEnabled ? '🔓 Désactiver 2FA' : '🔒 Activer 2FA'}
        </button>
      </div>

      {/* Sessions Actives */}
      <div className="settings-section">
        <h2>🌐 Sessions Actives</h2>
        <table style={{width: '100%'}}>
          <thead>
            <tr>
              <th>Appareil</th>
              <th>Adresse IP</th>
              <th>Dernière Activité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{session.device || 'Inconnu'}</td>
                <td>{session.ip_address}</td>
                <td>{new Date(session.last_activity).toLocaleString('fr-FR')}</td>
                <td>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRevokeSession(session.id)}
                  >
                    🗑️ Révoquer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
