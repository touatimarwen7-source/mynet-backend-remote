import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';

export default function TenderAwarding() {
  const [awardData, setAwardData] = useState({
    tenderId: 'TND-20251121-ABC123',
    selectedSupplier: 'Fournisseur C',
    totalAmount: 40000,
    items: [
      { id: 1, description: 'Item 1', quantity: 100, unitPrice: 200, total: 20000 },
      { id: 2, description: 'Item 2', quantity: 50, unitPrice: 400, total: 20000 }
    ],
    status: 'pending'
  });
  const [showNotificationForm, setShowNotificationForm] = useState(false);

  useEffect(() => {
    setPageTitle('Attribution des Appels d\'Offres');
  }, []);

  const handleFinalizeAward = () => {
    setAwardData({...awardData, status: 'finalized'});
    alert('Attribution finalisée avec succès!');
  };

  return (
    <div className="page tender-awarding-page">
      <div className="page-header corporate">
        <h1>🏆 Attribution des Appels d'Offres</h1>
        <p className="subtitle">Finalisez l'attribution du marché</p>
      </div>

      <div className="award-details corporate">
        <div className="detail-section">
          <h3>Informations de l'Attribution</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Appel d'Offres</label>
              <span>{awardData.tenderId}</span>
            </div>
            <div className="detail-item">
              <label>Fournisseur Sélectionné</label>
              <span className="highlight">{awardData.selectedSupplier}</span>
            </div>
            <div className="detail-item">
              <label>Montant Total</label>
              <span className="highlight">{awardData.totalAmount.toLocaleString()} TND</span>
            </div>
            <div className="detail-item">
              <label>Statut</label>
              <span className={`badge-${awardData.status}`}>{awardData.status === 'finalized' ? '✓ Finalisée' : '⏳ En attente'}</span>
            </div>
          </div>
        </div>

        <div className="items-section">
          <h3>Articles à Fournir</h3>
          <table className="table-corporate">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {awardData.items.map(item => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice.toLocaleString()} TND</td>
                  <td>{item.total.toLocaleString()} TND</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="3"><strong>TOTAL</strong></td>
                <td><strong>{awardData.totalAmount.toLocaleString()} TND</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="actions-section">
          <button onClick={() => setShowNotificationForm(true)} className="btn btn-secondary-corporate">📧 Notifier le Fournisseur</button>
          <button onClick={handleFinalizeAward} className="btn btn-primary-corporate" disabled={awardData.status === 'finalized'}>
            ✓ Finaliser l'Attribution
          </button>
        </div>

        {showNotificationForm && (
          <div className="notification-form corporate">
            <h4>Notifier le Fournisseur</h4>
            <textarea placeholder="Message de notification..." className="textarea-corporate"></textarea>
            <div className="form-actions">
              <button className="btn btn-primary-corporate">Envoyer</button>
              <button onClick={() => setShowNotificationForm(false)} className="btn btn-secondary-corporate">Annuler</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
