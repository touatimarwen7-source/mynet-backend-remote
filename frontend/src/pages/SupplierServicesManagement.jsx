import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/corporate-design.css';

export default function SupplierServicesManagement() {
  const [services, setServices] = useState([
    { id: 1, name: 'Service de Consultation', category: 'Conseil', hourlyRate: 100, availability: 'Disponible' },
    { id: 2, name: 'Service de Maintenance', category: 'Maintenance', hourlyRate: 75, availability: 'Disponible' }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({ name: '', category: '', hourlyRate: '', description: '' });

  useEffect(() => {
    setPageTitle('Gestion des Services');
  }, []);

  const handleAddService = () => {
    if (newService.name && newService.hourlyRate) {
      setServices([...services, {...newService, id: services.length + 1, hourlyRate: parseFloat(newService.hourlyRate), availability: 'Disponible'}]);
      setNewService({ name: '', category: '', hourlyRate: '', description: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="page supplier-services-page">
      <div className="page-header corporate">
        <h1>🔧 Gestion des Services</h1>
        <p className="subtitle">Gérez votre catalogue de services</p>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary-corporate">
          ➕ Ajouter un Service
        </button>
      </div>

      {showForm && (
        <div className="form-section corporate">
          <div className="form-grid">
            <input type="text" placeholder="Nom du service" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} className="input-corporate" />
            <input type="text" placeholder="Catégorie" value={newService.category} onChange={(e) => setNewService({...newService, category: e.target.value})} className="input-corporate" />
            <input type="number" placeholder="Tarif horaire (TND)" value={newService.hourlyRate} onChange={(e) => setNewService({...newService, hourlyRate: e.target.value})} className="input-corporate" />
            <textarea placeholder="Description du service" value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} className="textarea-corporate"></textarea>
          </div>
          <div className="form-actions">
            <button onClick={handleAddService} className="btn btn-primary-corporate">Ajouter</button>
            <button onClick={() => setShowForm(false)} className="btn btn-secondary-corporate">Annuler</button>
          </div>
        </div>
      )}

      <div className="services-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Nom du Service</th>
              <th>Catégorie</th>
              <th>Tarif Horaire</th>
              <th>Disponibilité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.category}</td>
                <td>{service.hourlyRate.toLocaleString()} TND/h</td>
                <td><span className="badge-available">{service.availability}</span></td>
                <td>
                  <button className="btn btn-small btn-secondary-corporate">Éditer</button>
                  <button className="btn btn-small btn-danger-corporate">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
