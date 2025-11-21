import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/corporate-design.css';

export default function TenderEvaluation() {
  const [offers, setOffers] = useState([
    { id: 1, supplier: 'Fournisseur A', price: 45000, compliance: 95, delivery: 15, quality: 90, total: 89.5, status: 'pending' },
    { id: 2, supplier: 'Fournisseur B', price: 52000, compliance: 85, delivery: 20, quality: 80, total: 82, status: 'pending' },
    { id: 3, supplier: 'Fournisseur C', price: 40000, compliance: 90, delivery: 18, quality: 95, total: 92.5, status: 'pending' }
  ]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [evaluationData, setEvaluationData] = useState({ price: 40, compliance: 30, delivery: 20, quality: 10 });

  useEffect(() => {
    setPageTitle('Évaluation des Offres');
  }, []);

  const handleSelectWinner = (offerId) => {
    setOffers(offers.map(o => o.id === offerId ? {...o, status: 'selected'} : {...o, status: 'rejected'}));
  };

  const handleReject = (offerId) => {
    setOffers(offers.map(o => o.id === offerId ? {...o, status: 'rejected'} : o));
  };

  return (
    <div className="page tender-evaluation-page">
      <div className="page-header corporate">
        <h1>📊 Évaluation des Offres</h1>
        <p className="subtitle">Comparez et évaluez les offres reçues</p>
      </div>

      <div className="evaluation-criteria">
        <h3>Critères d'Évaluation</h3>
        <div className="criteria-grid">
          <div className="criterion">
            <label>Prix (%)</label>
            <span>{evaluationData.price}%</span>
          </div>
          <div className="criterion">
            <label>Conformité (%)</label>
            <span>{evaluationData.compliance}%</span>
          </div>
          <div className="criterion">
            <label>Délai (%)</label>
            <span>{evaluationData.delivery}%</span>
          </div>
          <div className="criterion">
            <label>Qualité (%)</label>
            <span>{evaluationData.quality}%</span>
          </div>
        </div>
      </div>

      <div className="offers-evaluation">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Fournisseur</th>
              <th>Prix</th>
              <th>Conformité</th>
              <th>Délai</th>
              <th>Qualité</th>
              <th>Score Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.sort((a, b) => b.total - a.total).map(offer => (
              <tr key={offer.id} className={`status-${offer.status}`}>
                <td>{offer.supplier}</td>
                <td>{offer.price.toLocaleString()} TND</td>
                <td><span className="badge">{offer.compliance}%</span></td>
                <td><span className="badge">{offer.delivery} jours</span></td>
                <td><span className="badge">{offer.quality}%</span></td>
                <td><strong className="score">{offer.total}/100</strong></td>
                <td>
                  <span className={`badge-${offer.status}`}>{offer.status === 'selected' ? '✓ Sélectionné' : offer.status === 'rejected' ? '✗ Rejeté' : '⏳ En attente'}</span>
                </td>
                <td>
                  <button onClick={() => handleSelectWinner(offer.id)} className="btn btn-small btn-success" disabled={offer.status === 'rejected'}>Sélectionner</button>
                  <button onClick={() => handleReject(offer.id)} className="btn btn-small btn-danger">Rejeter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
