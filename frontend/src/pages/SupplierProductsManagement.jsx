import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/corporate-design.css';

export default function SupplierProductsManagement() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Produit A', category: 'Fournitures', price: 150, quantity: 500, unit: 'Unité' },
    { id: 2, name: 'Produit B', category: 'Fournitures', price: 250, quantity: 200, unit: 'Carton' }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', quantity: '', unit: 'Unité' });

  useEffect(() => {
    setPageTitle('Gestion des Produits');
  }, []);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      setProducts([...products, {...newProduct, id: products.length + 1, price: parseFloat(newProduct.price), quantity: parseInt(newProduct.quantity)}]);
      setNewProduct({ name: '', category: '', price: '', quantity: '', unit: 'Unité' });
      setShowForm(false);
    }
  };

  return (
    <div className="page supplier-products-page">
      <div className="page-header corporate">
        <h1>📦 Gestion des Produits</h1>
        <p className="subtitle">Gérez votre catalogue de produits</p>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary-corporate">
          ➕ Ajouter un Produit
        </button>
      </div>

      {showForm && (
        <div className="form-section corporate">
          <div className="form-grid">
            <input type="text" placeholder="Nom du produit" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="input-corporate" />
            <input type="text" placeholder="Catégorie" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="input-corporate" />
            <input type="number" placeholder="Prix (TND)" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="input-corporate" />
            <input type="number" placeholder="Quantité disponible" value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} className="input-corporate" />
            <select value={newProduct.unit} onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})} className="select-corporate">
              <option>Unité</option>
              <option>Carton</option>
              <option>Pallet</option>
              <option>Kg</option>
              <option>Tonne</option>
            </select>
          </div>
          <div className="form-actions">
            <button onClick={handleAddProduct} className="btn btn-primary-corporate">Ajouter</button>
            <button onClick={() => setShowForm(false)} className="btn btn-secondary-corporate">Annuler</button>
          </div>
        </div>
      )}

      <div className="products-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Nom du Produit</th>
              <th>Catégorie</th>
              <th>Prix Unitaire</th>
              <th>Quantité Disponible</th>
              <th>Unité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price.toLocaleString()} TND</td>
                <td>{product.quantity}</td>
                <td>{product.unit}</td>
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
