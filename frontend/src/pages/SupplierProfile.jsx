import { useState, useEffect } from 'react';
import axios from 'axios';
import { setPageTitle } from '../utils/pageTitle';

export default function SupplierProfile() {
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showPublicProfile, setShowPublicProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    setPageTitle('Profil du Fournisseur');
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/supplier/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setProfile(response.data.profile);
      setEditData(response.data.profile);
      setDocuments(response.data.documents || []);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'ISO');

    try {
      await axios.post('http://localhost:3000/api/supplier/documents', formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Document uploadé avec succès');
      fetchProfile();
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/supplier/documents/${docId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      alert('Document supprimé');
      fetchProfile();
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put('http://localhost:3000/api/supplier/profile', editData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setProfile(editData);
      setEditing(false);
      alert('Profil mis à jour avec succès');
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;

  return (
    <div className="supplier-profile">
      <h1>🏢 Profil du Fournisseur</h1>

      <div className="profile-layout">
        {/* Données de l'Entreprise */}
        <div className="profile-section">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>📋 Données de l'Entreprise</h2>
            {!editing && <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Modifier</button>}
          </div>

          {profile && (
            <div className="company-info">
              {editing ? (
                <div>
                  <div className="form-group">
                    <label>Nom de l'Entreprise:</label>
                    <input type="text" value={editData.company_name || ''} onChange={(e) => setEditData({...editData, company_name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Numéro Commercial:</label>
                    <input type="text" value={editData.commercial_number || ''} onChange={(e) => setEditData({...editData, commercial_number: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Siège Social:</label>
                    <input type="text" value={editData.location || ''} onChange={(e) => setEditData({...editData, location: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Téléphone:</label>
                    <input type="tel" value={editData.phone || ''} onChange={(e) => setEditData({...editData, phone: e.target.value})} />
                  </div>
                  <button className="btn btn-success" onClick={handleSaveProfile}>💾 Sauvegarder</button>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>Annuler</button>
                </div>
              ) : (
                <div>
                  <div className="info-row">
                    <label>Nom de l'Entreprise:</label>
                    <p>{profile.company_name}</p>
                  </div>
                  <div className="info-row">
                    <label>Numéro Commercial:</label>
                    <p>{profile.commercial_number}</p>
                  </div>
                  <div className="info-row">
                    <label>Siège Social:</label>
                    <p>{profile.location}</p>
                  </div>
                  <div className="info-row">
                    <label>Téléphone:</label>
                    <p>{profile.phone}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Domaines d'Expertise */}
        <div className="profile-section">
          <h2>🎯 Domaines d'Expertise</h2>
          <div className="categories-tags">
            {categories.length === 0 ? (
              <p className="empty-state">Aucun domaine défini</p>
            ) : (
              categories.map((cat, idx) => (
                <span key={idx} className="tag badge">{cat}</span>
              ))
            )}
          </div>
        </div>

        {/* Documents et Certificats */}
        <div className="profile-section">
          <h2>📄 Documents et Certificats</h2>
          
          <div className="document-upload">
            <label>Télécharger un Document:</label>
            <input 
              type="file" 
              onChange={handleDocumentUpload}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="documents-list">
            {documents.length === 0 ? (
              <p className="empty-state">Aucun document uploadé</p>
            ) : (
              <table style={{width: '100%', marginTop: '1rem'}}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date d'Upload</th>
                    <th>Date d'Expiration</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, idx) => (
                    <tr key={idx}>
                      <td>{doc.type}</td>
                      <td>{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</td>
                      <td>{new Date(doc.expiry_date).toLocaleDateString('fr-FR')}</td>
                      <td>
                        {doc.days_left < 30 ? (
                          <span className="badge badge-warning">⚠️ {doc.days_left} jours</span>
                        ) : (
                          <span className="badge badge-success">✓ Valide</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDocument(doc.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Profil Public */}
        <div className="profile-section">
          <h2>🌐 Profil Public</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowPublicProfile(!showPublicProfile)}
          >
            {showPublicProfile ? '🔒 Masquer le Profil Public' : '👁️ Afficher le Profil Public'}
          </button>

          {showPublicProfile && profile && (
            <div className="public-profile-preview" style={{marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
              <h3>{profile.company_name}</h3>
              <p><strong>Localisation:</strong> {profile.location}</p>
              <p><strong>Domaines:</strong> {categories.join(', ')}</p>
              <p><strong>Note:</strong> ⭐ {profile.average_rating || 0}/5</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
