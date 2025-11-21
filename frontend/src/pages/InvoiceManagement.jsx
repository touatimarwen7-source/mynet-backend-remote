import { useState, useEffect } from 'react';
import { procurementAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/corporate-design.css';

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Gestion des Factures');
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await procurementAPI.getInvoices?.({ status: filter }) || { data: { invoices: [] } };
      setInvoices(response.data?.invoices || []);
    } catch (error) {
      console.error('Erreur lors du chargement des factures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (invoiceId) => {
    try {
      await axios.put(`${API_BASE}/procurement/invoices/${invoiceId}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      console.log('تم الموافقة على الفاتورة');
      fetchInvoices();
    } catch (error) {
      console.error('خطأ:', error.response?.data?.error);
    }
  };

  const handleReject = async (invoiceId) => {
    try {
      await axios.put(`${API_BASE}/procurement/invoices/${invoiceId}/reject`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      console.log('تم رفض الفاتورة');
      fetchInvoices();
    } catch (error) {
      console.error('خطأ:', error.response?.data?.error);
    }
  };

  const handlePushToERP = async (invoiceId) => {
    try {
      await axios.post(`${API_BASE}/procurement/invoices/${invoiceId}/push-to-erp`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      console.log('تم الإرسال إلى نظام ERP بنجاح');
      fetchInvoices();
    } catch (error) {
      console.error('خطأ:', error.response?.data?.error);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;

  return (
    <div className="invoice-management">
      <h1>Gestion des Factures</h1>

      {/* التصفية */}
      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          En Attente
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approuvées
        </button>
        <button 
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejetées
        </button>
        <button 
          className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
          onClick={() => setFilter('paid')}
        >
          Payées
        </button>
      </div>

      {/* Tableau des Factures */}
      {invoices.length === 0 ? (
        <p className="empty-state">Aucune facture في هذه Catégorie</p>
      ) : (
        <div className="invoices-table-wrapper">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Numéro de Facture</th>
                <th>المورد</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>{invoice.number}</td>
                  <td>{invoice.supplier_name}</td>
                  <td>{invoice.amount} {invoice.currency}</td>
                  <td>{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                  <td className={`status status-${invoice.status}`}>{invoice.status}</td>
                  <td className="actions">
                    {invoice.status === 'pending' && (
                      <>
                        <button 
                          className="btn-approve"
                          onClick={() => handleApprove(invoice.id)}
                        >
                          Approuver
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => handleReject(invoice.id)}
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                    {invoice.status === 'approved' && (
                      <button 
                        className="btn-erp"
                        onClick={() => handlePushToERP(invoice.id)}
                      >
                        Envoyer à l'ERP
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
