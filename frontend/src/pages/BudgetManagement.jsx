import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/corporate-design.css';

export default function BudgetManagement() {
  const [budgets, setBudgets] = useState([
    { id: 1, name: 'Budget Fournitures', total: 50000, spent: 32500, remaining: 17500, category: 'Fournitures', year: 2025 },
    { id: 2, name: 'Budget Services', total: 80000, spent: 45000, remaining: 35000, category: 'Services', year: 2025 },
    { id: 3, name: 'Budget Construction', total: 150000, spent: 89500, remaining: 60500, category: 'Construction', year: 2025 }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ name: '', total: '', category: '' });

  useEffect(() => {
    setPageTitle('Gestion des Budgets');
  }, []);

  const handleAddBudget = () => {
    if (newBudget.name && newBudget.total) {
      setBudgets([...budgets, {
        id: budgets.length + 1,
        name: newBudget.name,
        total: parseFloat(newBudget.total),
        spent: 0,
        remaining: parseFloat(newBudget.total),
        category: newBudget.category,
        year: 2025
      }]);
      setNewBudget({ name: '', total: '', category: '' });
      setShowForm(false);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.total, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0);

  return (
    <div className="page budget-management-page">
      <div className="page-header corporate">
        <div className="header-content">
          <h1>💰 Gestion des Budgets</h1>
          <p className="subtitle">Suivez et gérez vos allocations budgétaires</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary-corporate">
          ➕ Nouveau Budget
        </button>
      </div>

      {showForm && (
        <div className="form-section corporate">
          <h3>Créer un Nouveau Budget</h3>
          <div className="form-grid">
            <input type="text" placeholder="Nom du budget" value={newBudget.name} onChange={(e) => setNewBudget({...newBudget, name: e.target.value})} className="input-corporate" />
            <input type="number" placeholder="Montant total (TND)" value={newBudget.total} onChange={(e) => setNewBudget({...newBudget, total: e.target.value})} className="input-corporate" />
            <select value={newBudget.category} onChange={(e) => setNewBudget({...newBudget, category: e.target.value})} className="select-corporate">
              <option value="">Sélectionner une catégorie</option>
              <option value="Fournitures">Fournitures</option>
              <option value="Services">Services</option>
              <option value="Construction">Construction</option>
              <option value="Conseil">Conseil</option>
            </select>
          </div>
          <div className="form-actions">
            <button onClick={handleAddBudget} className="btn btn-primary-corporate">Ajouter</button>
            <button onClick={() => setShowForm(false)} className="btn btn-secondary-corporate">Annuler</button>
          </div>
        </div>
      )}

      <div className="summary-cards">
        <div className="card corporate">
          <label>Budget Total</label>
          <span className="value">{totalBudget.toLocaleString()} TND</span>
        </div>
        <div className="card corporate">
          <label>Total Dépensé</label>
          <span className="value">{totalSpent.toLocaleString()} TND</span>
        </div>
        <div className="card corporate">
          <label>Restant</label>
          <span className="value success">{totalRemaining.toLocaleString()} TND</span>
        </div>
      </div>

      <div className="budgets-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Nom du Budget</th>
              <th>Catégorie</th>
              <th>Total</th>
              <th>Dépensé</th>
              <th>Restant</th>
              <th>Utilisation %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map(budget => (
              <tr key={budget.id}>
                <td>{budget.name}</td>
                <td>{budget.category}</td>
                <td>{budget.total.toLocaleString()} TND</td>
                <td>{budget.spent.toLocaleString()} TND</td>
                <td>{budget.remaining.toLocaleString()} TND</td>
                <td>
                  <div className="progress-bar">
                    <div className="progress" style={{width: `${(budget.spent / budget.total * 100)}%`}}></div>
                    <span>{((budget.spent / budget.total) * 100).toFixed(1)}%</span>
                  </div>
                </td>
                <td>
                  <button className="btn btn-small btn-secondary-corporate">Éditer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
